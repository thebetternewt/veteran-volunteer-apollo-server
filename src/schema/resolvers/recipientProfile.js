import { RecipientProfile, User } from '../../models'
import {
  formatLocationInput,
  formatLocationOutput,
} from '../../utils/locations'

export default {
  RecipientProfile: {
    location: parent => formatLocationOutput(parent.location),
    user: parent => User.findById(parent.user),
  },
  Query: {
    recipientProfile: async (parent, { id }, { user }) =>
      RecipientProfile.findById(id),
    recipientProfiles: async () => RecipientProfile.find({}),
  },
  Mutation: {
    createRecipientProfile: async (parent, { location, ...args }, { user }) => {
      const profile = await RecipientProfile.findOne({ user: user.id })

      if (profile) {
        throw new Error('Profile already exists for user.')
      }

      const newProfile = await RecipientProfile.create({
        user: user.id,
        location: formatLocationInput(location),
        ...args,
      })

      return newProfile
    },

    updateRecipientProfile: async (parent, { location, ...args }, { user }) => {
      console.log(location, args)
      const updatedAttributes = { ...args }

      if (location) {
        updatedAttributes.location = formatLocationInput(location)
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
