import Joi from 'joi'
import {
  ChildcareNeed,
  LawncareNeed,
  Need,
  TravelNeed,
  User,
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
    __resolveType: (parent, ctx, info) => {
      switch (parent.needType) {
        case 'TRAVEL':
          return 'TravelNeed'
        case 'LAWNCARE':
          return 'LawncareNeed'
        case 'CHILDCARE':
          return 'ChildcareNeed'
        default:
          return null
      }
    },
  },
  Need: {
    needDetails: async (parent, args, { user }) => {
      switch (parent.needType) {
        case 'TRAVEL':
          return TravelNeed.findOne({ need: parent })
        case 'LAWNCARE':
          return LawncareNeed.findOne({ need: parent })
        case 'CHILDCARE':
          return ChildcareNeed.findOne({ need: parent })
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
    needs: async (parent, args) => {
      const { needType, location, range } = args

      let queryParams = {}

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
      console.log('need args:', args)

      const {
        title,
        date,
        needType,
        needDetailsId,
        notes,
        location,
        travelNeedDetails,
        childcareNeedDetails,
      } = args

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

      // Check for needType and Details

      if (needType === 'TRAVEL') {
        const [newNeedDetails] = await TravelNeed.create(
          [
            {
              ...travelNeedDetails,
              fromLocation: formatLocationInput(travelNeedDetails.fromLocation),
              toLocation: formatLocationInput(travelNeedDetails.toLocation),
              need: newNeed,
            },
          ],
          { session }
        )

        // await assert.ok(newNeedDetails)
      } else if (needType === 'CHILDCARE') {
        const errors = await Joi.validate(
          childcareNeedDetails,
          childcareNeedSchema,
          {
            abortEarly: false,
          }
        )

        const [newNeedDetails] = await ChildcareNeed.create(
          [{ ...childcareNeedDetails, need: newNeed }],
          { session }
        )
      } else {
        // Abort transaction if no need details created.
        session.abortTransaction()
      }

      await session.commitTransaction()

      return newNeed
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
