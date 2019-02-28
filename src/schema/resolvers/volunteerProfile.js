import { User, VolunteerProfile } from '../../models'
import { geoArrayToObj, geoObjToArray } from '../../utils/convertCoordinates'

export default {
  VolunteerProfile: {
    serviceLocation: parent => ({
      address: parent.serviceLocation.address,
      ...geoArrayToObj(parent.serviceLocation.point.coordinates),
    }),
    user: parent => User.findById(parent.user),
  },
  Query: {
    VolunteerProfile: async (parent, { id }, { user }) =>
      VolunteerProfile.findById(id),
    VolunteerProfiles: async () => VolunteerProfile.find({}),
  },
  Mutation: {
    createVolunteerProfile: async (
      parent,
      { serviceLocation, ...args },
      { user }
    ) => {
      console.log('Volunteer profile args:', args)

      // Check if volunteer profile already exists for user
      const profile = await VolunteerProfile.findOne({ user: user.id })

      if (profile) {
        throw new Error('Profile already exists for user.')
      }

      // Create new profile
      const newProfile = await VolunteerProfile.create({
        user: user.id,
        serviceLocation: {
          address: serviceLocation.address,
          point: {
            type: 'Point',
            coordinates: geoObjToArray(serviceLocation),
          },
        },
        ...args,
      })

      return newProfile
    },

    updateVolunteerProfile: async (
      parent,
      { serviceLocation, ...args },
      { user }
    ) => {
      console.log('updatedVolProfile args:', serviceLocation, args)
      // Search for volunteer profile for user
      const profile = await VolunteerProfile.findOne({ user })

      // Throw error if profile doesn't exist
      if (!profile) {
        throw new Error('User has no volunteer profile.')
      }

      const updatedAttributes = { ...args }

      // Set new serviceLocation field if in args
      if (serviceLocation) {
        updatedAttributes.serviceLocation = {
          address: serviceLocation.address,
          point: {
            type: 'Point',
            coordinates: geoObjToArray(serviceLocation),
          },
        }
      }

      profile.set({
        ...updatedAttributes,
      })

      await profile.save()

      return profile
    },
  },
}
