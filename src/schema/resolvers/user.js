const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// const gravatar = require('gravatar');
const { User } = require('../../models')
// const verifyUser = require('../../util/verifyUser');

module.exports = {
  User: {},
  Query: {
    me: async (parent, args, { user }) => {
      // verifyUser({ user });

      // user is authenticated
      return User.findById(user.id)
    },
    user: async (parent, { id }, { user }) => {
      // verifyUser({
      //   user,
      //   testUserId: id,
      //   current: true,
      //   admin: true,
      // });
      return User.findById(id)
    },
    users: async (parent, { limit }, { user }) => {
      // verifyUser({ user, admin: true });
      return User.find()
        .limit(limit || 10)
        .exec()
    },
  },

  Mutation: {
    signup: async (parent, { email, password, ...name }) => {
      // Check for user with given email address.
      const user = await User.findOne({ email }).exec()
      if (user) {
        throw new Error('User already exists.')
      }

      // const avatar = gravatar.url(email, {
      //   s: '200', // Size
      //   r: 'pg', // Rating
      //   d: 'mm', // Default
      // });

      const hashedPass = await bcrypt.hash(password, 10)

      const newUser = new User({
        ...name,
        email: email,
        password: hashedPass,
      })

      await newUser.save()

      return newUser
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        email: email.toLowerCase(),
      }).exec()

      // TODO: Apollo AuthenticationError

      if (!user) {
        throw new Error('No user with that email')
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        throw new Error('Invalid login credentials')
      }

      const { firstName, middleName, lastName } = user
      const fullName = `${firstName} ${middleName} ${lastName}`

      return jwt.sign(
        { id: user.id, name: fullName, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
    },
    updateUser: async (parent, args, { user }) => {
      const { id, admin, password, email, ...updatedProperties } = args

      // verifyUser({ user, testUserId: id, current: true, admin: true })

      // Only allow update of admin if current user is admin and
      // only update admin if specified args
      // if (user.admin && admin !== undefined) {
      //   updatedProperties.admin = admin
      // }

      // console.log('verify user passed')

      if (email) {
        // Check for user with that email address.
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser) {
          throw new Error('User already exists.')
        }

        // Generate new gravatar url from email
        const avatar = gravatar.url(email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm', // Default
        })

        updatedProperties.email = email
        updatedProperties.avatar = avatar
      }

      if (password) {
        // Hash new password
        const hashedPass = await bcrypt.hash(password, 10)
        updatedProperties.password = hashedPass
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...updatedProperties } },
        { new: true }
      ).exec()

      if (!updatedUser) {
        throw new Error('User not found')
      }

      return updatedUser
    },
    deleteUser: async (parent, { id }, { user }) => {
      // verifyUser({ user, testUserId: id, current: true, admin: true })

      const removedUser = await User.findOneAndRemove({ _id: id }).exec()

      if (!removedUser) {
        throw new Error('User not found')
      }

      return removedUser.id
    },
  },
}
