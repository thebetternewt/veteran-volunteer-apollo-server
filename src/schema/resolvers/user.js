import { AuthenticationError } from 'apollo-server-core'
import bcrypt from 'bcryptjs'
import { attemptSignIn, signOut } from '../../auth'
import { Need, RecipientProfile, User, VolunteerProfile } from '../../models'

export default {
  User: {
    fullName: async parent => `${parent.firstName} ${parent.lastName}`,
    recipientProfile: async parent =>
      RecipientProfile.findOne({ user: parent }),
    volunteerProfile: async parent =>
      VolunteerProfile.findOne({ user: parent }),
    requestedNeeds: async parent => {
      const needs = await Need.find({ recipient: parent })

      await needs.forEach(
        async need => await need.populate('serviceDetails').execPopulate()
      )

      return needs
    },
    volunteeredNeeds: async parent => {
      const needs = await Need.find({ volunteer: parent })

      await needs.forEach(
        async need => await need.populate('serviceDetails').execPopulate()
      )

      return needs
    },
  },
  Query: {
    me: async (parent, args, { req }) => {
      const { userId } = req.session
      return User.findById(userId)
    },
    user: async (parent, { id }, { req }) => {
      // verifyUser({
      //   user,
      //   testUserId: id,
      //   current: true,
      //   admin: true,
      // });
      return User.findById(id)
    },
    users: async (parent, { limit }, { req }) => {
      // verifyUser({ user, admin: true });
      return User.find()
        .limit(limit)
        .exec()
    },
  },

  Mutation: {
    signup: async (parent, { email, password, ...args }) => {
      // Check for user with given email address.
      const user = await User.findOne({ email }).exec()
      if (user) {
        throw new Error('User with this email already exists.')
      }

      // TODO: Sanitize args input

      const hashedPass = await bcrypt.hash(password, 10)

      const newUser = new User({
        ...args,
        email: email,
        password: hashedPass,
      })

      await newUser.save()
      console.log(newUser)

      return newUser
    },
    login: async (parent, { email, password }, { req }) => {
      // const user = await User.findOne({
      //   email: email.toLowerCase(),
      // }).exec()

      const user = await attemptSignIn(email, password)

      if (!user) {
        throw new AuthenticationError('Invalid email or password')
      }

      console.log(user)

      req.session.userId = user.id
      req.session.isAdmin = user.admin

      console.log(req.session)

      const { id, firstName, lastName, avatar = null } = user
      // const fullName = `${firstName} ${lastName}`

      // return jwt.sign(
      //   { id, firstName, lastName, fullName, email, avatar },
      //   process.env.JWT_SECRET,
      //   // TODO: update to lower time limit before launch
      //   { expiresIn: '1d' }
      // )
      return user
    },

    signOut: async (parent, args, { req, res }) => signOut(req, res),
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

        updatedProperties.email = email
      }

      // NOTE: Password now hashed on model
      // if (password) {
      //   // Hash new password
      //   const hashedPass = await bcrypt.hash(password, 10);
      //   updatedProperties.password = hashedPass;
      // }

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
    deleteUser: async (parent, { id }) => {
      // verifyUser({ user, testUserId: id, current: true, admin: true })

      const removedUser = await User.findOneAndRemove({ _id: id }).exec()

      if (!removedUser) {
        throw new Error('User not found')
      }

      return true
    },
    activateUser: async (_, { id }) => {
      const user = await User.findById(id).exec()

      user.set({ active: true })
      await user.save()

      return true
    },
    deactivateUser: async (_, { id }) => {
      const user = await User.findById(id).exec()

      user.set({ active: false })
      await user.save()

      return true
    },
  },
}
