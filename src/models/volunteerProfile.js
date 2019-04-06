import mongoose from 'mongoose'
import 'mongoose-geojson-schema'
import needTypes from './needTypes/types'

const {
  Schema,
  Types: { ObjectId, Point },
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
      bio: String,
      availability: {
        weekdays: {
          type: Boolean,
          default: false,
        },
        weekends: {
          type: Boolean,
          default: false,
        },
        details: String,
      },
      servicesProvided: [
        {
          type: String,
          enum: needTypes,
        },
      ],
      skills: [String],
      serviceLocation: {
        address: {
          type: String,
          required: true,
        },
        point: {
          type: Point,
          required: true,
          index: '2dsphere',
        },
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
