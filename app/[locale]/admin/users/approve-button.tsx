'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { approveSeller } from '@/lib/actions/user.actions'
import { useTransition } from 'react'

export default function ApproveButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  return (
    <Button
      variant='outline'
      size='sm'
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await approveSeller(id)
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            })
          } else {
            toast({
              description: res.message,
            })
          }
        })
      }}
    >
      {isPending ? 'Approving...' : 'Approve'}
    </Button>
  )
}
