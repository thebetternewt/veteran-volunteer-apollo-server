import mongoose from 'mongoose';
import 'mongoose-geojson-schema';

const {
  Schema,
  Types: { ObjectId, Point }
} = mongoose;

const schema = new Schema(
  {
    needType: {
      type: String,
      default: 'TRAVEL'
    },

    fromLocation: {
      address: {
        type: String,
        required: true
      },
      point: {
        type: Point,
        required: true
      }
    },
    toLocation: {
      address: {
        type: String,
        required: true
      },
      point: {
        type: Point,
        required: true
      }
    },
    need: {
      type: ObjectId,
      ref: 'Need',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('TravelNeed', schema);
