import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

const schema = new Schema(
  {
    needType: {
      type: String,
      default: 'OTHER',
    },
    description: { type: String, required: true },
    need: {
      type: ObjectId,
      ref: 'Need',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('OtherNeed', schema)
