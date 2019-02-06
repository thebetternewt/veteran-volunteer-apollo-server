import GeoJSON from 'mongoose-geojson-schema'
import { TravelService } from '../../models'

export default {
  TravelService: {
    fromLocation: parent => parent.fromLocation.coordinates,
    toLocation: parent => parent.toLocation.coordinates,
  },
  Query: {
    travelService: async () => {},
    travelServices: async () => TravelService.find({}),
  },
  Mutation: {
    createTravelService: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user

      const { fromName, fromLocation, toName, toLocation } = args

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
        })

        // Transform locations from point objects to arrays of coordinates
        const transformedTravelService = transformTravelService(travelService)

        return travelService
      } catch (err) {
        return error
      }
    },
  },
}

const transformTravelService = travelService => ({
  id: travelService.id,
  fromName: travelService.fromName,
  fromLocation: travelService.fromLocation.coordinates,
  toName: travelService.toName,
  toLocation: travelService.toLocation.coordinates,
})
