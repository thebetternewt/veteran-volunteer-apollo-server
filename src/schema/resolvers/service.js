import { Service, TravelService } from '../../models'

const METERS_PER_MILE = 1609.34

const transformTravelService = travelService => ({
  id: travelService.id,
  fromName: travelService.fromName,
  fromLocation: travelService.fromLocation.coordinates,
  toName: travelService.toName,
  toLocation: travelService.toLocation.coordinates,
})

export default {
  Service: {
    travelServiceDetails: async (parent, args, { user }) => {
      const serviceWithDetails = await parent
        .populate('serviceDetails')
        .execPopulate()

      return parent.serviceDetails
    },
  },
  Query: {
    service: async () => {},
    services: async (parent, args) => {
      const { serviceType, startPoint, range } = args

      let fromLocationQuery = {}

      if (serviceType === 'TravelService' && startPoint && range) {
        console.log(startPoint, range)

        fromLocationQuery = {
          fromLocation: {
            $geoWithin: {
              $centerSphere: [[...startPoint], range / 3963.2],
            },
          },
        }

        const travelServices = await TravelService.find(
          fromLocationQuery
        ).exec()
        console.log('travelservices:', travelServices)
      }

      return Service.find({}).exec()
    },
  },
  Mutation: {
    createService: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user
      console.log('service args', args)

      const { title, serviceType, serviceDetailsId, notes } = args

      try {
        const service = await Service.create({
          title,
          serviceType,
          serviceDetails: serviceDetailsId,
          notes,
          recipient: user.id,
        })

        return service
      } catch (err) {
        throw new Error(err)
      }

      return null
    },
  },
}
