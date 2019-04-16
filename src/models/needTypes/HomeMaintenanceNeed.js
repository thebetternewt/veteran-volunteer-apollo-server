import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

const schema = new Schema(
  {
    needType: {
      type: String,
      default: 'HOME_MAINTENANCE',
    },
    maintenanceType: {
      type: String,
      required: true,
    },
    equipmentSupplied: {
      type: Boolean,
    },
    partsSupplied: {
      type: Boolean,
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

export default mongoose.model('HomeMaintenanceNeed', schema)
