import { IWebPageInput } from '@/types'
import mongoose, { Document, Model, model, Schema } from 'mongoose'

export interface IWebPage extends Document, IWebPageInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const webPageSchema = new Schema<IWebPage>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const WebPage =
  (((mongoose.models as unknown) as { WebPage?: Model<IWebPage> }).WebPage as Model<IWebPage>) ||
  model<IWebPage>('WebPage', webPageSchema)

export default WebPage
