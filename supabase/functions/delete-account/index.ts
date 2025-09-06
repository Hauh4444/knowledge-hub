import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        )

        if (userError || !user) {
            console.error('User verification error:', userError)
            return new Response(
                JSON.stringify({ error: 'Invalid user token' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        console.log(`Starting account deletion for user: ${user.id}`)

        const deleteOperations = [
            supabaseClient.from('likes').delete().eq('user_id', user.id),
            supabaseClient.from('bookmarks').delete().eq('user_id', user.id),
            supabaseClient.from('resource_views').delete().eq('user_id', user.id),
            supabaseClient.from('comments').delete().eq('author_id', user.id),
            supabaseClient.from('notifications').delete().eq('user_id', user.id),
            supabaseClient.from('project_tasks').delete().eq('assignee_id', user.id),
            supabaseClient.from('resources').delete().eq('author_id', user.id),
            supabaseClient.from('projects').delete().eq('owner_id', user.id),
            supabaseClient.from('profiles').delete().eq('id', user.id),
        ]

        for (const operation of deleteOperations) {
            const { error } = await operation
            if (error) {
                console.error('Error during data deletion:', error)
            }
        }

        const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(user.id)

        if (deleteUserError) {
            console.error('Error deleting user account:', deleteUserError)
            return new Response(
                JSON.stringify({ error: 'Failed to delete user account' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        console.log(`Successfully deleted account for user: ${user.id}`)

        return new Response(
            JSON.stringify({ message: 'Account successfully deleted' }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})