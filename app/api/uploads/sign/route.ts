import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { cloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  const session = await auth.getSession()

  if (!session.data?.user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const { paramsToSign } = await request.json()

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({ signature })
}
