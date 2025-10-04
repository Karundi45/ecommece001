import { connectToDatabase } from '@/lib/db'

// dotenv may be a dev dependency and not always installed in the environment
// so load it dynamically and ignore failures.
async function tryLoadDotenv() {
  try {
    const dotenv = await import('dotenv')
    dotenv.config?.({ path: '.env.local' })
  } catch {
    // ignore - env may already be provided by the environment
  }
}

async function run() {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      'RESEND_API_KEY not set. Set it in .env.local to send a test email.'
    )
    process.exit(0)
  }

  console.log('Connecting to DB (for sample order lookup)...')
  await connectToDatabase(process.env.MONGODB_URI)

  // Try to find a recent order to use in the test email
  const Order = (await import('@/lib/db/models/order.model')).default
  const order = await Order.findOne().lean()
  if (!order) {
    console.log(
      'No order found in DB. Ensure you have seeded data or provide an order to test with.'
    )
    try {
      const mongoose = await import('mongoose')
      await mongoose.disconnect()
    } catch {
      // ignore
    }
    process.exit(0)
  }

  // order.user can be populated user object or a user id string depending on how orders were saved
  let recipient: string | undefined
  if (order.user && typeof order.user === 'object' && 'email' in order.user) {
    // order.user may be a populated user object at runtime; narrow and read email safely
    recipient = (order.user as { email?: string }).email
  } else if (order.user && typeof order.user === 'string') {
    // If only a user id is present we don't have an email here
    recipient = undefined
  }

  if (!recipient) {
    console.log('Found order but it has no user.email. Ensure seeded orders include user.email')
    try {
      const mongoose = await import('mongoose')
      await mongoose.disconnect()
    } catch {
      // ignore
    }
    process.exit(0)
  }

  try {
    console.log('Sending test "ask review" email to', recipient)
    const { sendAskReviewOrderItems } = await import('@/emails')
    await sendAskReviewOrderItems({ order })
    console.log('Email send attempted. Check your Resend dashboard or mailbox.')
    try {
      const mongoose = await import('mongoose')
      await mongoose.disconnect()
    } catch {
      // ignore
    }
    process.exit(0)
  } catch (err) {
    console.error('Failed to send test email', err)
    try {
      const mongoose = await import('mongoose')
      await mongoose.disconnect()
    } catch {
      // ignore
    }
    process.exit(1)
  }
}

tryLoadDotenv().then(run).catch((e) => {
  console.error('Unexpected error starting send-test-email', e)
  process.exit(1)
})
