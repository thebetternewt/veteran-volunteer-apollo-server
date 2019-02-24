import {
  ChildcareService,
  LawncareService,
  Service,
  TravelService,
  User,
} from '../../models'
import { mongoose as db } from '../../server'
import { geoArrayToObj, geoObjToArray } from '../../utils/convertCoordinates'

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
        return geoArrayToObj(parent.location.coordinates)
      }

      return null
    },
    recipient: parent => User.findById(parent.recipient),
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
      console.log('service args', args)

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
      console.log('serviceType', typeof serviceType)

      // Create service
      const [newService] = await Service.create(
        [
          {
            title,
            date: new Date(date),
            serviceType,
            serviceDetails: serviceDetailsId,
            notes,
            recipient: user.id,
            location: {
              type: 'Point',
              coordinates: geoObjToArray(location),
            },
          },
        ],
        { session }
      )

      console.log('newService', newService)
      // Verify created service
      // await assert.ok(newService)

      // Check for serviceType and Details

      let newServiceDetails
      if (serviceType === 'TRAVEL') {
        ;[newServiceDetails] = await TravelService.create(
          [
            {
              ...travelServiceDetails,
              fromLocation: {
                type: 'Point',
                coordinates: geoObjToArray(travelServiceDetails.fromLocation),
              },
              toLocation: {
                type: 'Point',
                coordinates: geoObjToArray(travelServiceDetails.toLocation),
              },
              service: newService.id,
            },
          ],
          { session }
        )

        console.log('newServiceDetails', newServiceDetails)
        // await assert.ok(newServiceDetails)
      } else if (serviceType === 'CHILDCARE') {
        ;[newServiceDetails] = await ChildcareService.create(
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
  },
}
