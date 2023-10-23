import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ events: [] })
    }
    const res = await axios.get(`https://queenbee.gputopia.ai/v1/fine_tuning/jobs/${id}/events`, {
      headers: {
        Authorization: `Bearer ac4a9ce1c028c7a1e652d11f4d7e009e`
      }
    })
    const json = await res.data
    console.log(json)

    return NextResponse.json({ events: json.reverse() })
  } catch (error) {
    console.log(error)
  }
}
