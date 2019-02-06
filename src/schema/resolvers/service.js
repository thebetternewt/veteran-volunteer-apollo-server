import { Service, TravelService, LawncareService } from '../../models'

const METERS_PER_MILE = 1609.34

const transformTravelService = travelService => ({
  id: travelService.id,
  fromName: travelService.fromName,
  fromLocation: travelService.fromLocation.coordinates,
  toName: travelService.toName,
  toLocation: travelService.toLocation.coordinates,
})

export default {
  ServiceDetails: {
    __resolveType: (parent, ctx, info) => {
      switch (parent.serviceType) {
        case 'TRAVEL':
          return 'TravelService'
        case 'LAWNCARE':
          return 'LawncareService'
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
        default:
          return null
      }
    },
    location: parent => {
      if (parent.location) {
        return parent.location.coordinates
      }

      return null
    },
  },
  Query: {
    service: async () => {},
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
              coordinates: location,
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

      const { title, serviceType, serviceDetailsId, notes, location } = args

      try {
        const service = await Service.create({
          title,
          serviceType,
          serviceDetails: serviceDetailsId,
          notes,
          recipient: user.id,
          location: {
            type: 'Point',
            coordinates: location,
          },
        })

        return service
      } catch (err) {
        throw new Error(err)
      }

      return null
    },
  },
}
