import mongoose, { Document, Model, model, Schema } from 'mongoose'

export interface IAffiliate extends Document {
  name: string
  email: string
  website?: string
  message?: string
  createdAt: Date
  updatedAt: Date
}

const affiliateSchema = new Schema<IAffiliate>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    message: { type: String },
  },
  { timestamps: true }
)

const Affiliate =
  (((mongoose.models as unknown) as { Affiliate?: Model<IAffiliate> }).Affiliate as Model<IAffiliate>) ||
  model<IAffiliate>('Affiliate', affiliateSchema)

export default Affiliate
