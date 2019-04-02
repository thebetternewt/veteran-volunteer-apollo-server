import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

const messageSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: ObjectId,
      ref: 'User',
      require: true,
    },
    associatedNeed: {
      type: ObjectId,
      ref: 'Need',
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Message', messageSchema)
