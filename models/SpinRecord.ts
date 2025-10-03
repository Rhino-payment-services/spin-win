import mongoose, { Document, Schema } from 'mongoose'

export interface ISpinRecord extends Document {
  deviceId: string
  prizeWon: string
  spunAt: Date
  createdAt: Date
}

const SpinRecordSchema = new Schema<ISpinRecord>({
  deviceId: {
    type: String,
    required: true
  },
  prizeWon: {
    type: String,
    required: true
  },
  spunAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.models.SpinRecord || mongoose.model<ISpinRecord>('SpinRecord', SpinRecordSchema)
