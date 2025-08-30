import { NextRequest, NextResponse } from "next/server";

export default async function middleware(_: NextRequest) {
  return NextResponse.next({
    request: {
      headers: undefined
    }
  })
}

export const config = {
    matcher: ['/*'],
}