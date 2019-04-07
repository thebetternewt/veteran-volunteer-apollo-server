import mongoose from 'mongoose'
import { User, VolunteerProfile } from '../../models'
import {
  formatLocationInput,
  formatLocationOutput,
} from '../../utils/locations'

const METERS_PER_MILE = 1609.34

export default {
  VolunteerProfile: {
    serviceLocation: parent => formatLocationOutput(parent.serviceLocation),
    user: parent => User.findById(parent.user),
  },
  Query: {
    volunteerProfile: async (parent, { id }, { req }) =>
      VolunteerProfile.findById(id),
    volunteerProfilesForNeed: async (
      parent,
      { needType, location },
      { req }
    ) => {
      const { userId } = req.session
      const geoPoint = formatLocationInput(location).point
      console.log('geoPoint:', geoPoint)

      // Perform aggregation to find profiles that serve an area containing
      // the need location and provide service for the specified type of need.
      const profiles = await VolunteerProfile.aggregate([
        // Get profiles (closest first) from the need location.
        {
          $geoNear: {
            near: geoPoint,
            distanceField: 'distance',
          },
        },

        // Redact those who do not serve the location based on their specified
        // serviceRadius.
        {
          $redact: {
            $cond: {
              if: {
                $lt: [
                  { $divide: [`$distance`, METERS_PER_MILE] },
                  '$serviceRadius',
                ],
              },
              then: '$$KEEP',
              else: '$$PRUNE',
            },
          },
        },

        // Filter profiles who provided the specified need type.
        {
          $match: {
            servicesProvided: needType,
            // Exclude profile of current user.
            user: { $ne: mongoose.Types.ObjectId(userId) },
          },
        },

        // Add the 'id' field for graphQL type since mongodb
        // returns it as '_id'.
        { $addFields: { id: '$_id' } },
      ])

      console.log('profiles:', profiles)

      return profiles
    },
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
