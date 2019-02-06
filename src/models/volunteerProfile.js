import mongoose from 'mongoose'
import pointSchema from './helperSchemas/pointSchema'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

export default mongoose.model(
  'VolunteerProfile',
  new Schema(
    {
      user: {
        type: ObjectId,
        ref: 'User',
        required: true,
      },
      serviceLocation: {
        type: pointSchema,
        required: true,
      },
      serviceRadius: {
        type: Number,
        required: true,
        default: 10,
      },
    },
    {
      timestamps: true,
    }
  )
)
