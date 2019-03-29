import mongoose from 'mongoose';
import 'mongoose-geojson-schema';
import needTypes from './needTypes/types';

const {
  Schema,
  Types: { ObjectId, Point }
} = mongoose;

const needSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    recipient: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    volunteer: {
      type: ObjectId,
      ref: 'User'
    },
    location: {
      address: {
        type: String,
        required: true
      },
      point: {
        type: Point,
        required: true
      }
    },
    notes: String,
    date: {
      type: Date,
      required: true
    },
    needType: {
      type: String,
      required: true,
      enum: needTypes
    }
  },
  {
    timestamps: true
  }
);

needSchema.index({ 'location.point': '2dsphere' });

export default mongoose.model('Need', needSchema);
