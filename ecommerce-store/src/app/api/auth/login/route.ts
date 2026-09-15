import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findUserByEmail } from "@/lib/data";
import { sessionCookieOptions, signSession } from "@/lib/auth";
import { json } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return json(
        {
          error:
            "MongoDB is not configured. Set MONGODB_URI in the environment (Vercel → Settings → Environment Variables).",
        },
        500,
      );
    }

    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return json({ error: "Email and password are required." }, 400);
    }

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return json({ error: "Invalid email or password." }, 401);
    }

    if (user.role !== "admin") {
      return json({ error: "Invalid email or password." }, 401);
    }

    const token = await signSession({
      id: user._id,
      email: user.email,
      name: user.name,
      role: "admin",
    });

    const store = await cookies();
    store.set("admin_session", token, sessionCookieOptions());

    return json({ ok: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    const isMongo =
      /MONGODB_URI|buffering timed out|Server selection timed out|ECONNREFUSED|MongoNetwork/i.test(
        message,
      );
    return json(
      {
        error: isMongo
          ? "Could not reach MongoDB. Check MONGODB_URI and that the Atlas cluster is running."
          : message,
      },
      500,
    );
  }
}
