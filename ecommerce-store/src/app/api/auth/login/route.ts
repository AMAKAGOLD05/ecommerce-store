import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/data";
import { COOKIE_NAME, sessionCookieOptions, signSession } from "@/lib/session-token";

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          error:
            "MongoDB is not configured. Set MONGODB_URI in the environment (Vercel → Settings → Environment Variables).",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSession({
      id: user._id,
      email: user.email,
      name: user.name,
      role: "admin",
    });

    // Set cookie on the response so browsers always receive Set-Cookie.
    const response = NextResponse.json({
      ok: true,
      user: { name: user.name, email: user.email },
    });
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    const isMongo =
      /MONGODB_URI|buffering timed out|Server selection timed out|ECONNREFUSED|MongoNetwork|querySrv/i.test(
        message,
      );
    return NextResponse.json(
      {
        error: isMongo
          ? "Could not reach MongoDB. Check MONGODB_URI and that the Atlas cluster is running."
          : message,
      },
      { status: 500 },
    );
  }
}
