import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized(realm = "Secure Area"){
    return new Response("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": `Basic realm="${realm}"`},
    });
}

function secureCompare(a: string, b: string){
    if(a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++){
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

export function proxy(req: NextRequest) {
    const isProtected = req.nextUrl.pathname.startsWith("/api/secret");

    if(!isProtected) return NextResponse.next();

    const header = req.headers.get("authorization") || "";
    if(!header.startsWith("Basic")) return unauthorized();

    let decoded: string;
    try{
        decoded = atob(header.slice(6));
    }catch{
        return unauthorized();
    }

    const sepIndex = decoded.indexOf(":");
    if(sepIndex === -1) return unauthorized();

    const user = decoded.slice(0,sepIndex);
    const pass = decoded.slice(sepIndex + 1);

    console.log('user:' + user);
    console.log('pass:' + pass);

    const expectedUser = process.env.BASIC_ABIS_USER || "";
    const expectedPass = process.env.BASIC_ABIS_PASS || "";

    console.log('Exuser:' + expectedUser);
    console.log('Expass:' + expectedPass);

    const ok = secureCompare(user, expectedUser) && secureCompare(pass, expectedPass);

    return ok ? NextResponse.next() : unauthorized();
}

export const config = {
    matcher: ["/api/secret/:path*"],
}