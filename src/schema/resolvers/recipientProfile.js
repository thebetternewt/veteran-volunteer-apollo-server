import { RecipientProfile, User } from '../../models'

export default {
  RecipientProfile: {
    location: parent => parent.location.coordinates,
    user: parent => User.findById(parent.user),
  },
  Query: {
    recipientProfile: async (parent, args, { user }) =>
      RecipientProfile.findById(id),
    recipientProfiles: async () => RecipientProfile.find({}),
  },
  Mutation: {
    createRecipientProfile: async (parent, args, { user }) => {
      const profile = await RecipientProfile.findOne({ user: user.id })

      if (profile) {
        throw new Error('Profile already exists for user.')
      }

      const { lat, lng } = args

      const newProfile = await RecipientProfile.create({
        user: user.id,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        ...args,
      })

      return newProfile
    },

    updateRecipientProfile: async (parent, args, { user }) => {
      const { lat, lng } = args

      const updatedAttributes = {}

      if (lat && lng) {
        updatedAttributes.location = {
          type: 'Point',
          coordinates: [lng, lat],
        }
      }

      const profile = await RecipientProfile.findOne({ user })

      profile.set({
        ...updatedAttributes,
        ...args,
      })

      await profile.save()

      return profile
    },
  },
}
