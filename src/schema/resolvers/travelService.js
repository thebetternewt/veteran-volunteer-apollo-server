import { geoArrayToObj } from '../../utils/convertCoordinates'

export default {
  TravelService: {
    fromLocation: parent => ({
      address: parent.fromLocation.address,
      ...geoArrayToObj(parent.fromLocation.point.coordinates),
    }),
    toLocation: parent => ({
      address: parent.toLocation.address,
      ...geoArrayToObj(parent.toLocation.point.coordinates),
    }),
  },
  Query: {
    // travelService: async () => {},
    // travelServices: async () => TravelService.find({}),
  },
}
