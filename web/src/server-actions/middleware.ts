import {  NextResponse } from "next/server";

export default async function middleware() {
  return NextResponse.next({
    request: {
      headers: undefined
    }
  })
}

export const config = {
    matcher: ['/*'],
}