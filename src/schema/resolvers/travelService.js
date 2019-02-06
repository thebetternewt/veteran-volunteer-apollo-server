import GeoJSON from 'mongoose-geojson-schema'
import { TravelService } from '../../models'

export default {
  TravelService: {
    fromLocation: parent => parent.fromLocation.coordinates,
    toLocation: parent => parent.toLocation.coordinates,
  },
  Query: {
    // travelService: async () => {},
    // travelServices: async () => TravelService.find({}),
  },
  Mutation: {
    createTravelService: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user

      const { fromName, fromLocation, toName, toLocation, serviceId } = args

      try {
        const travelService = await TravelService.create({
          fromName,
          fromLocation: {
            type: 'Point',
            coordinates: fromLocation,
          },
          toName,
          toLocation: {
            type: 'Point',
            coordinates: toLocation,
          },
          service: serviceId,
        })

        return travelService
      } catch (err) {
        return error
      }
    },
  },
}
