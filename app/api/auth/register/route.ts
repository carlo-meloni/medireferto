import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Email, password e conferma password sono obbligatorie" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Le password non coincidono" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La password deve essere di almeno 8 caratteri" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email già registrata" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "DOCTOR",
        ...(name && {
          doctor: {
            create: {
              firstName: name.split(" ")[0] ?? name,
              lastName: name.split(" ").slice(1).join(" ") || "",
            },
          },
        }),
      },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
