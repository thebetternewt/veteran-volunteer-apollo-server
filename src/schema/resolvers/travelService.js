import { geoArrayToObj } from '../../utils/convertCoordinates'

export default {
  TravelService: {
    fromLocation: parent => geoArrayToObj(parent.fromLocation.coordinates),
    toLocation: parent => geoArrayToObj(parent.toLocation.coordinates),
  },
  Query: {
    // travelService: async () => {},
    // travelServices: async () => TravelService.find({}),
  },
}
