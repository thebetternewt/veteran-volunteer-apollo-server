import { AuthenticationError } from 'apollo-server-core'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RecipientProfile, Service, User, VolunteerProfile } from '../../models'

export default {
  User: {
    fullName: async parent => `${parent.firstName} ${parent.lastName}`,
    recipientProfile: async parent =>
      RecipientProfile.findOne({ user: parent }),
    volunteerProfile: async parent =>
      VolunteerProfile.findOne({ user: parent }),
    requestedServices: async parent => {
      const services = await Service.find({ recipient: parent })

      await services.forEach(
        async service => await service.populate('serviceDetails').execPopulate()
      )

      return services
    },
    volunteeredServices: async parent => {
      const services = await Service.find({ volunteer: parent })

      await services.forEach(
        async service => await service.populate('serviceDetails').execPopulate()
      )

      return services
    },
  },
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

      return newUser
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        email: email.toLowerCase(),
      }).exec()

      if (!user) {
        throw new AuthenticationError('Invalid email or password')
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        throw new AuthenticationError('Invalid email or password')
      }

      const { id, firstName, lastName, avatar = null } = user
      const fullName = `${firstName} ${lastName}`

      return jwt.sign(
        { id, firstName, lastName, fullName, email, avatar },
        process.env.JWT_SECRET,
        // TODO: update to lower time limit before launch
        { expiresIn: '1d' }
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
        // const avatar = gravatar.url(email, {
        //   s: '200', // Size
        //   r: 'pg', // Rating
        //   d: 'mm', // Default
        // })

        updatedProperties.email = email
        // updatedProperties.avatar = avatar
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
