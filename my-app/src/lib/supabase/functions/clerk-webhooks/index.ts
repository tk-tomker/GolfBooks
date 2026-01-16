import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyWebhook } from 'npm:@clerk/backend/webhooks'

Deno.serve(async (req) => {
  // Verify webhook signature
  const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')

  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const event = await verifyWebhook(req, { signingSecret: webhookSecret })

  // Create supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response('Supabase credentials not configured', { status: 500 })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  switch (event.type) {
    case 'user.created': {
      // Handle user creation
      const username = event.data.username || 
        `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim() || 
        event.data.email_addresses?.[0]?.email_address?.split('@')[0] || 
        'user'
      
      const email = event.data.email_addresses?.[0]?.email_address || event.data.primary_email_address_id

      const { data: user, error } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: event.data.id,
            username: username,
            email: email,
            created_at: new Date(event.data.created_at).toISOString(),
            role: 0,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
      }

      return new Response(JSON.stringify({ user }), { status: 200 })
    }

    case 'user.updated': {
      // Handle user update
      const username = event.data.username || 
        `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim() || 
        event.data.email_addresses?.[0]?.email_address?.split('@')[0] || 
        'user'
      
      const email = event.data.email_addresses?.[0]?.email_address || event.data.primary_email_address_id

      const { data: user, error } = await supabase
        .from('users')
        .update({
          username: username,
          email: email,
        })
        .eq('clerk_id', event.data.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
      }

      return new Response(JSON.stringify({ user }), { status: 200 })
    }

    // Organization handlers removed — organizations are managed elsewhere.

    case 'organizationMembership.created': {
      const { data, error } = await supabase
        .from('members')
        .insert([
          {
            id: event.data.id,
            user_id: event.data.public_user_data?.user_id,
            organization_id: event.data.organization?.id,
            created_at: new Date(event.data.created_at).toISOString(),
            updated_at: new Date(event.data.updated_at).toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error updating member:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
      }

      return new Response(JSON.stringify({ data }), { status: 200 })
    }

    case 'organizationMembership.updated': {
      const { data, error } = await supabase
        .from('members')
        .update({
          user_id: event.data.public_user_data?.user_id,
          organization_id: event.data.organization?.id,
          updated_at: new Date(event.data.updated_at).toISOString(),
        })
        .eq('id', event.data.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating member:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
      }

      return new Response(JSON.stringify({ data }), { status: 200 })
    }

    default: {
      // Unhandled event type
      console.log('Unhandled event type:', JSON.stringify(event, null, 2))
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }
  }
})