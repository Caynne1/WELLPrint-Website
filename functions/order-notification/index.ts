// Supabase Edge Function: order-notification
// Triggered by database webhook on INSERT to orders table.
//
// Setup:
//   1. Deploy: supabase functions deploy order-notification
//   2. Set secrets:
//      supabase secrets set RESEND_API_KEY=re_xxxxx
//      supabase secrets set NOTIFICATION_FROM=orders@wellprint.com.ph
//      supabase secrets set STAFF_NOTIFICATION_EMAIL=hello@wellprint.com.ph
//   3. Create webhook in Supabase Dashboard → Database → Webhooks:
//      Table: orders, Events: INSERT
//      URL: https://<project>.supabase.co/functions/v1/order-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('NOTIFICATION_FROM') || 'orders@wellprint.com.ph'
const STAFF_EMAIL = Deno.env.get('STAFF_NOTIFICATION_EMAIL') || 'hello@wellprint.com.ph'

serve(async (req) => {
  try {
    const payload = await req.json()

    // Webhook payload structure from Supabase
    const { type, record } = payload

    if (type !== 'INSERT' || !record) {
      return new Response(JSON.stringify({ message: 'Ignored' }), { status: 200 })
    }

    const order = record
    const orderId = order.id
    const customerName = order.customer_name || 'Customer'
    const customerEmail = order.customer_email
    const orderType = order.order_type || 'Print Order'
    const estimatedTotal = Number(order.estimated_total || 0).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
    })

    // ── 1. Customer confirmation email ────────────────────────
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Order Received — ${orderId.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
            <div style="background: #002C5F; padding: 28px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
                WELLPrint
              </h1>
            </div>

            <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #002C5F; font-size: 20px; margin: 0 0 8px 0;">
                Thanks, ${customerName}!
              </h2>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                We've received your <strong>${orderType}</strong> and our team will
                review it shortly. You'll receive updates as your order progresses.
              </p>

              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="color: #9ca3af; padding: 4px 0;">Order Reference</td>
                    <td style="text-align: right; font-weight: 600; color: #1f2937;">
                      ${orderId.slice(0, 8).toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #9ca3af; padding: 4px 0;">Estimated Total</td>
                    <td style="text-align: right; font-weight: 600; color: #1f2937;">
                      ${estimatedTotal}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #9ca3af; padding: 4px 0;">Status</td>
                    <td style="text-align: right;">
                      <span style="background: rgba(25,147,210,0.12); color: #1993D2; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;">
                        Pending Review
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
                If you have questions, reply to this email or contact us at
                <a href="mailto:${STAFF_EMAIL}" style="color: #1993D2;">${STAFF_EMAIL}</a>.
              </p>
            </div>
          </div>
        `,
      })
    }

    // ── 2. Staff notification email ───────────────────────────
    await sendEmail({
      to: STAFF_EMAIL,
      subject: `New Order: ${customerName} — ${orderType}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; max-width: 560px;">
          <h2 style="margin: 0 0 12px 0;">New Order Received</h2>

          <table style="font-size: 14px; border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Customer</td><td><strong>${customerName}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td>${customerEmail}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td>${order.customer_phone || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Type</td><td>${orderType}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Est. Total</td><td><strong>${estimatedTotal}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Order ID</td><td><code>${orderId}</code></td></tr>
          </table>

          ${order.notes ? `<p style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 8px; font-size: 13px; color: #374151;"><strong>Notes:</strong> ${order.notes}</p>` : ''}

          <p style="margin-top: 20px;">
            <a href="https://wellprint.com.ph/dashboard/orders/${orderId}"
               style="background: #002C5F; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
              View in Dashboard
            </a>
          </p>
        </div>
      `,
    })

    return new Response(
      JSON.stringify({ success: true, orderId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('order-notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})


// ─── Email sender (Resend API) ─────────────────────────────────
async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email to', to)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `WELLPrint <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`Email send failed (${res.status}):`, body)
  }
}
