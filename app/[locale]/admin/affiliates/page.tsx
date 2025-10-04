import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteAffiliate, getAllAffiliates } from '@/lib/actions/affiliate.actions'
import { IAffiliate } from '@/lib/db/models/affiliate.model'
import { formatId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin Affiliates',
}

export default async function AdminAffiliates(props: { searchParams: Promise<{ page: string }> }) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (session?.user.role !== 'Admin') throw new Error('Admin permission required')
  const page = Number(searchParams.page) || 1
  const affiliates = await getAllAffiliates({ page })

  return (
    <div className='space-y-2'>
      <h1 className='h1-bold'>Affiliates</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(affiliates?.data as IAffiliate[]).map((a) => (
              <TableRow key={String(a._id)}>
                <TableCell>{formatId(String(a._id))}</TableCell>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.website || '-'}</TableCell>
                <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/affiliates/${String(a._id)}`}>View</Link>
                  </Button>
                  <DeleteDialog id={String(a._id)} action={deleteAffiliate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {affiliates?.totalPages > 1 && <Pagination page={page} totalPages={affiliates?.totalPages} />}
      </div>
    </div>
  )
}
