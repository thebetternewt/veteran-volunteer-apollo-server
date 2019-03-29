import { formatLocationOutput } from '../../../utils/locations';

export default {
  TravelNeed: {
    fromLocation: parent => formatLocationOutput(parent.fromLocation),
    toLocation: parent => formatLocationOutput(parent.toLocation)
  }
};
