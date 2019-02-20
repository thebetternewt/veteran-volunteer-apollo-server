import { TravelService } from '../../models'
import { geoArrayToObj, geoObjToArray } from '../../utils/convertCoordinates'

export default {
  TravelService: {
    fromLocation: parent => geoArrayToObj(parent.fromLocation.coordinates),
    toLocation: parent => geoArrayToObj(parent.toLocation.coordinates),
  },
  Query: {
    // travelService: async () => {},
    // travelServices: async () => TravelService.find({}),
  },
  Mutation: {
    createTravelService: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user

      const { fromName, fromLocation, toName, toLocation, serviceId } = args

      const travelService = await TravelService.create({
        fromName,
        fromLocation: {
          type: 'Point',
          coordinates: geoObjToArray(fromLocation),
        },
        toName,
        toLocation: {
          type: 'Point',
          coordinates: geoObjToArray(toLocation),
        },
        service: serviceId,
      })

      return travelService
    },
  },
}
