import { connectToDatabase } from '@/lib/db'
import Affiliate, { IAffiliate } from '@/lib/db/models/affiliate.model'

export async function getAllAffiliates({ page = 1, limit = 20 } = {}): Promise<{ data: IAffiliate[]; total: number; totalPages: number }> {
  await connectToDatabase()
  const skip = (page - 1) * limit
  const total = await Affiliate.countDocuments()
  const data = await Affiliate.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  const totalPages = Math.ceil(total / limit)
  return { data, total, totalPages }
}

export async function deleteAffiliate(id: string): Promise<{ success: boolean; message: string }> {
  await connectToDatabase()
  const res = await Affiliate.findByIdAndDelete(id)
  return { success: !!res, message: 'Affiliate deleted successfully' }
}
