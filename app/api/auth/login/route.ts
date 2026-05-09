import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json();

  const username = body.username;
  const password = body.password;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim() === "" ||
    password.trim() === ""
  ) {
    return Response.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username.trim(),
    },
  });

  if (!user) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return Response.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
}
