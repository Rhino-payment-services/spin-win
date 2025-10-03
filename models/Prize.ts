import mongoose, { Document, Schema } from 'mongoose'

export interface IPrize extends Document {
  name: string
  total: number
  dailyLimit: number
  currentStock: number
  dailyDistributed: number
  lastResetDate: string
  createdAt: Date
  updatedAt: Date
}

const PrizeSchema = new Schema<IPrize>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  dailyLimit: {
    type: Number,
    required: true,
    default: 0
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  dailyDistributed: {
    type: Number,
    required: true,
    default: 0
  },
  lastResetDate: {
    type: String,
    required: true,
    default: () => new Date().toDateString()
  }
}, {
  timestamps: true
})

export default mongoose.models.Prize || mongoose.model<IPrize>('Prize', PrizeSchema)
