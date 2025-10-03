import mongoose, { Document, Schema } from 'mongoose'

export interface IDevice extends Document {
  deviceId: string
  hasSpun: boolean
  spunAt?: Date
  createdAt: Date
  updatedAt: Date
}

const DeviceSchema = new Schema<IDevice>({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  hasSpun: {
    type: Boolean,
    required: true,
    default: false
  },
  spunAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)
