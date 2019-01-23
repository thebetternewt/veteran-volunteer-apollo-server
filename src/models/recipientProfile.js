const mongoose = require('mongoose')
const pointSchema = require('./helperSchemas/pointSchema')

const {
  Schema,
  Types: { ObjectId },
} = mongoose

module.exports = mongoose.model(
  'RecipientProfile',
  new Schema(
    {
      user: {
        type: ObjectId,
        ref: 'User',
        required: true,
      },
      branch: String,
      deployed: {
        type: Boolean,
        default: false,
      },
      household: [
        {
          name: { type: String, required: true },
          relationship: { type: String, required: true },
          userId: { type: ObjectId, ref: 'User' },
        },
      ],
      location: {
        type: pointSchema,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
)
