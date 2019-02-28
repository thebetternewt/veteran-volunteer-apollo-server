import { formatLocationOutput } from '../../utils/locations'

export default {
  TravelService: {
    fromLocation: parent => formatLocationOutput(parent.fromLocation),
    toLocation: parent => formatLocationOutput(parent.toLocation),
  },
}
