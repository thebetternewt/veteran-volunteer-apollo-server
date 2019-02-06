import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

export default mongoose.model(
  'Service',
  new Schema(
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
      serviceDetails: {
        type: ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `serviceType` property to find the right model.
        refPath: 'serviceType',
      },
      serviceType: {
        type: String,
        required: true,
        enum: ['TravelService'],
      },
      notes: String,
    },
    {
      timestamps: true,
    }
  )
)
