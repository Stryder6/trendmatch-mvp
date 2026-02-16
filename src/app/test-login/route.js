import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect('http://localhost:3000/dashboard')
  response.cookies.set('tm_user_id', 'd7859697-e147-4cc4-a171-72c6b46e294f', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
