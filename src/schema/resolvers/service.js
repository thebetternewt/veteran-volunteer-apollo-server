import Joi from 'joi'
import {
  ChildcareService,
  LawncareService,
  Service,
  TravelService,
  User,
} from '../../models'
import { mongoose as db } from '../../server'
import { geoArrayToObj, geoObjToArray } from '../../utils/convertCoordinates'
import { childcareServiceSchema } from '../../validation/services'

const METERS_PER_MILE = 1609.34

export default {
  ServiceDetails: {
    __resolveType: (parent, ctx, info) => {
      switch (parent.serviceType) {
        case 'TRAVEL':
          return 'TravelService'
        case 'LAWNCARE':
          return 'LawncareService'
        case 'CHILDCARE':
          return 'ChildcareService'
        default:
          return null
      }
    },
  },
  Service: {
    serviceDetails: async (parent, args, { user }) => {
      switch (parent.serviceType) {
        case 'TRAVEL':
          return TravelService.findOne({ service: parent })
        case 'LAWNCARE':
          return LawncareService.findOne({ service: parent })
        case 'CHILDCARE':
          return ChildcareService.findOne({ service: parent })
        default:
          return null
      }
    },
    location: parent => {
      if (parent.location) {
        return {
          address: parent.location.address,
          ...geoArrayToObj(parent.location.point.coordinates),
        }
      }

      return null
    },
    recipient: parent => User.findById(parent.recipient),
    volunteer: parent => User.findById(parent.volunteer),
  },
  Query: {
    service: async (_, { id }) => Service.findById(id),
    services: async (parent, args) => {
      const { serviceType, location, range } = args

      let queryParams = {}

      if (serviceType) {
        queryParams.serviceType = serviceType
      }

      if (location && range) {
        queryParams.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: geoObjToArray(location),
            },
            $maxDistance: range * METERS_PER_MILE,
            // $minDistance: 5 * METERS_PER_MILE,
          },
        }
      }

      return Service.find(queryParams).exec()
    },
  },
  Mutation: {
    createService: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user
      // console.log('service args', args)

      const {
        title,
        date,
        serviceType,
        serviceDetailsId,
        notes,
        location,
        travelServiceDetails,
        childcareServiceDetails,
      } = args

      const session = await db.startSession()

      console.log('starting transaction...')
      session.startTransaction()

      // Create service
      const [newService] = await Service.create(
        [
          {
            title,
            date: new Date(date),
            serviceType,
            notes,
            recipient: user.id,
            location: {
              address: location.address,
              point: {
                type: 'Point',
                coordinates: geoObjToArray(location),
              },
            },
          },
        ],
        { session }
      )

      // Check for serviceType and Details

      if (serviceType === 'TRAVEL') {
        const [newServiceDetails] = await TravelService.create(
          [
            {
              ...travelServiceDetails,
              fromLocation: {
                address: travelServiceDetails.fromLocation.address,
                point: {
                  type: 'Point',
                  coordinates: geoObjToArray(travelServiceDetails.fromLocation),
                },
              },
              toLocation: {
                address: travelServiceDetails.toLocation.address,
                point: {
                  type: 'Point',
                  coordinates: geoObjToArray(travelServiceDetails.toLocation),
                },
              },
              service: newService,
            },
          ],
          { session }
        )

        // await assert.ok(newServiceDetails)
      } else if (serviceType === 'CHILDCARE') {
        const errors = await Joi.validate(
          childcareServiceDetails,
          childcareServiceSchema,
          {
            abortEarly: false,
          }
        )

        const [newServiceDetails] = await ChildcareService.create(
          [{ ...childcareServiceDetails, service: newService }],
          { session }
        )
      } else {
        // Abort transaction if no service details created.
        session.abortTransaction()
      }

      await session.commitTransaction()

      return newService
    },

    assignVolunteer: async (_, { serviceId, volunteerId }, { user }) => {
      const service = await Service.findById(serviceId).exec()

      if (service) {
        // TODO: Handle other checks before assigning volunteer:
        // (1) Make sure user is logged in (may be handled in auth directive)
        // (2) Make sure request exists
        // (3) Make sure user is volunteer or recipient
        // (4) Check if volunteer is user (may be handled in createRequest)
        // (5) Make sure volunteer provides service type (may be handled in createRequest)
        // ...

        service.set({
          volunteer: volunteerId,
        })

        await service.save()

        return service
      }

      // TODO: Throw error if no service found?
      return null
    },
  },
}
