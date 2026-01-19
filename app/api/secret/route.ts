import { NextRequest } from "next/server";
import { withAuth } from '../../../lib/with-auth';

async function secretGet(request: NextRequest) {
    return new Response(JSON.stringify({secret: 'Authenticated users can see this'}), {
        headers: { 'Content-Type': 'application/json'},
    });
}

export const GET = withAuth(secretGet);