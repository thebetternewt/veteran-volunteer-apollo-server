import { User, VolunteerProfile } from '../../models'
import {
  formatLocationInput,
  formatLocationOutput,
} from '../../utils/locations'

export default {
  VolunteerProfile: {
    serviceLocation: parent => formatLocationOutput(parent.serviceLocation),
    user: parent => User.findById(parent.user),
  },
  Query: {
    VolunteerProfile: async (parent, { id }, { req }) =>
      VolunteerProfile.findById(id),
    VolunteerProfiles: async () => VolunteerProfile.find({}),
  },
  Mutation: {
    createVolunteerProfile: async (
      parent,
      { serviceLocation, ...args },
      { req }
    ) => {
      const { userId } = req.session
      console.log('Volunteer profile args:', args)

      // Check if volunteer profile already exists for user
      const profile = await VolunteerProfile.findOne({ user: userId })

      if (profile) {
        throw new Error('Profile already exists for user.')
      }

      // Create new profile
      const newProfile = await VolunteerProfile.create({
        user: userId,
        serviceLocation: formatLocationInput(serviceLocation),
        ...args,
      })

      return newProfile
    },

    updateVolunteerProfile: async (
      parent,
      { serviceLocation, ...args },
      { req }
    ) => {
      const { userId } = req.session
      console.log('updatedVolProfile args:', serviceLocation, args)
      // Search for volunteer profile for user
      const profile = await VolunteerProfile.findOne({ user: userId })

      // Throw error if profile doesn't exist
      if (!profile) {
        throw new Error('User has no volunteer profile.')
      }

      const updatedAttributes = { ...args }

      // Set new serviceLocation field if in args
      if (serviceLocation) {
        updatedAttributes.serviceLocation = formatLocationInput(serviceLocation)
      }

      profile.set({
        ...updatedAttributes,
      })

      await profile.save()

      return profile
    },
  },
}
