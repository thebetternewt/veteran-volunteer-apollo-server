import mongoose from 'mongoose'

const STATUS_OPTIONS = [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'COMPLETED',
]
const INITIATOR_OPTIONS = ['RECIPIENT', 'VOLUNTEER']

const {
  Schema,
  Types: { ObjectId },
} = mongoose

const requestSchema = new Schema(
  {
    need: {
      type: ObjectId,
      ref: 'Need',
      required: true,
    },
    recipient: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    volunteer: {
      type: ObjectId,
      ref: 'User',
      require: true,
    },
    initiator: {
      type: String,
      enum: INITIATOR_OPTIONS,
      default: INITIATOR_OPTIONS[0],
    },
    status: {
      type: String,
      enum: STATUS_OPTIONS,
      default: STATUS_OPTIONS[0],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Request', requestSchema)
