import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data tidak valid",
        },
        { status: 400 }
      );
    }

    const { nama, email, telepon, password, role } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        telepon,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        telepon: true,
        role: true,
        createdAt: true,
      },
    });

    // Create e-wallet for the user
    await prisma.eWallet.create({
      data: {
        userId: user.id,
        saldo: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Registrasi berhasil",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
