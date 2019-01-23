const mongoose = require('mongoose')

const {
  Schema,
  Types: { ObjectId },
} = mongoose

module.exports = mongoose.model(
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
      notes: String,
    },
    {
      timestamps: true,
    }
  )
)
