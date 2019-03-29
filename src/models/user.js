import { compare, hash } from 'bcryptjs'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: String,
    lastName: {
      type: String,
      required: true,
    },
    age: { type: Number, required: true },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      zipcode: String,
    },
    avatar: String,
    admin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password on save if modified
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await hash(password, 10)
  }
})

userSchema.statics.doesntExist = async function(options) {
  return (await this.where(options).countDocuments()) === 0
}

userSchema.methods.matchesPassword = function(password) {
  return compare(password, this.password)
}

export default mongoose.model('User', userSchema)
