import 'mongoose-geojson-schema'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    recipient: {
      type: ObjectId,
      ref: 'RecipientProfile',
      required: true,
    },
    volunteer: {
      type: ObjectId,
      ref: 'VolunteerProfile',
    },
    location: {
      type: Point,
      required: true,
    },
    notes: String,
    // serviceDetails: {
    //   type: ObjectId,
    //   required: true,
    //   // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    //   // will look at the `serviceType` property to find the right model.
    //   refPath: 'serviceType',
    // },
    serviceType: {
      type: String,
      required: true,
      enum: ['TRAVEL', 'LAWNCARE'],
    },
  },
  {
    timestamps: true,
  }
)

serviceSchema.index({ location: '2dsphere' })

export default mongoose.model('Service', serviceSchema)
