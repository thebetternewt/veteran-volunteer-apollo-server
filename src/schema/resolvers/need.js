import Joi from 'joi'
import {
  User,
  Need,
  ChildcareNeed,
  HomeMaintenanceNeed,
  LawncareNeed,
  TravelNeed,
  OtherNeed,
} from '../../models'
import { mongoose as db } from '../../server'
import {
  formatLocationInput,
  formatLocationOutput,
  geoObjToArray,
} from '../../utils/locations'
import { childcareNeedSchema } from '../../validation/needs'

const METERS_PER_MILE = 1609.34

export default {
  NeedDetails: {
    __resolveType: parent => {
      switch (parent.needType) {
        case 'TRAVEL':
          return 'TravelNeed'
        case 'LAWNCARE':
          return 'LawncareNeed'
        case 'HOME_MAINTENANCE':
          return 'HomeMaintenanceNeed'
        case 'CHILDCARE':
          return 'ChildcareNeed'
        case 'OTHER':
          return 'OtherNeed'
        default:
          return null
      }
    },
  },
  Need: {
    needDetails: async parent => {
      switch (parent.needType) {
        case 'TRAVEL':
          return TravelNeed.findOne({ need: parent })
        case 'LAWNCARE':
          return LawncareNeed.findOne({ need: parent })
        case 'CHILDCARE':
          return ChildcareNeed.findOne({ need: parent })
        case 'HOME_MAINTENANCE':
          return HomeMaintenanceNeed.findOne({ need: parent })
        case 'OTHER':
          return OtherNeed.findOne({ need: parent })
        default:
          return null
      }
    },
    location: parent => formatLocationOutput(parent.location),
    recipient: parent => User.findById(parent.recipient),
    volunteer: parent => User.findById(parent.volunteer),
  },
  Query: {
    need: async (_, { id }) => Need.findById(id),
    needs: async (parent, args, { req }) => {
      const { currentUser, needType, location, range } = args

      let queryParams = {}

      if (currentUser) {
        queryParams.recipient = req.session.userId
      }

      if (needType) {
        queryParams.needType = needType
      }

      if (location && range) {
        queryParams['location.point'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: geoObjToArray(location),
            },
            $maxDistance: range * METERS_PER_MILE,
          },
        }
      }

      // TODO: Filter out needs that belong to current user.

      return Need.find(queryParams).exec()
    },
  },
  Mutation: {
    createNeed: async (parent, args, { req }) => {
      const { userId } = req.session
      // TODO: Check if profile already exists for user

      const {
        title,
        date,
        needType,
        notes,
        location,
        travelNeedDetails,
        childcareNeedDetails,
        homeMaintenanceNeedDetails,
        otherNeedDetails,
      } = args

      console.log('OTHER:', otherNeedDetails)

      try {
        const session = await db.startSession()

        console.log('starting transaction...')
        session.startTransaction()

        // Create need
        const [newNeed] = await Need.create(
          [
            {
              title,
              date: new Date(date),
              needType,
              notes,
              recipient: userId,
              location: formatLocationInput(location),
            },
          ],
          { session }
        )

        // Create Need Details based on needType
        switch (needType) {
          case 'TRAVEL':
            await TravelNeed.create(
              [
                {
                  ...travelNeedDetails,
                  fromLocation: formatLocationInput(
                    travelNeedDetails.fromLocation
                  ),
                  toLocation: formatLocationInput(travelNeedDetails.toLocation),
                  need: newNeed,
                },
              ],
              { session }
            )
            break
          case 'CHILDCARE':
            const errors = await Joi.validate(
              childcareNeedDetails,
              childcareNeedSchema,
              {
                abortEarly: false,
              }
            )

            await ChildcareNeed.create(
              [{ ...childcareNeedDetails, need: newNeed }],
              { session }
            )
            break
          case 'HOME_MAINTENANCE':
            await HomeMaintenanceNeed.create(
              [{ ...homeMaintenanceNeedDetails, need: newNeed }],
              { session }
            )
            break
          case 'OTHER':
            await OtherNeed.create([{ ...otherNeedDetails, need: newNeed }], {
              session,
            })
            break
          default:
            // Abort transaction if no need details created.
            session.abortTransaction()
            throw new Error('Something went wrong.')
        }

        await session.commitTransaction()

        return newNeed
      } catch (err) {
        console.log(err)
        throw new Error(err)
      }
    },

    assignVolunteer: async (_, { needId, volunteerId }, { user }) => {
      const need = await Need.findById(needId).exec()

      if (need) {
        // TODO: Handle other checks before assigning volunteer:
        // (1) Make sure user is logged in (may be handled in auth directive)
        // (2) Make sure request exists
        // (3) Make sure user is volunteer or recipient
        // (4) Check if volunteer is user (may be handled in createRequest)
        // (5) Make sure volunteer provides need type (may be handled in createRequest)
        // ...

        need.set({
          volunteer: volunteerId,
        })

        await need.save()

        return need
      }

      // TODO: Throw error if no need found?
      return null
    },
  },
}
