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
      default: 'LAWNCARE'
    },
    equipmentNeeded: {
      type: Boolean,
      default: false
    },
    description: String,
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

export default mongoose.model('LawncareNeed', schema);
