import mongoose from 'mongoose';
import 'mongoose-geojson-schema';

const ages = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER'];

const {
  Schema,
  Types: { ObjectId, Point }
} = mongoose;

const schema = new Schema(
  {
    needType: {
      type: String,
      default: 'CHILDCARE'
    },
    age: {
      type: [String],
      required: true
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

export default mongoose.model('ChildcareNeed', schema);
