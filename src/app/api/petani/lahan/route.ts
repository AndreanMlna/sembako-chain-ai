import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Lahan, Tanaman } from "@prisma/client";
import { lahanSchema } from "@/lib/validators";

interface LahanWithRelations extends Lahan {
  tanaman: Tanaman[];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }
    if (session.user.role !== "PETANI") {
        return NextResponse.json(
            { success: false, message: "Forbidden — hanya Petani" },
            { status: 403 }
        );
    }


    const dataLahanRaw = (await prisma.lahan.findMany({
      where: {
        petaniId: session.user.id,
      },
      include: {
        tanaman: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as LahanWithRelations[];

    const dataLahanFormatted = dataLahanRaw.map((lahan) => ({
      id: lahan.id,
      petaniId: lahan.petaniId,
      nama: lahan.nama,
      luasHektar: lahan.luasHektar,
      createdAt: lahan.createdAt,
      updatedAt: lahan.updatedAt,
      lokasi: {
        jalan: lahan.jalan || "",
        kelurahan: lahan.kelurahan || "",
        kecamatan: lahan.kecamatan || "",
        kabupaten: lahan.kabupaten || "",
        provinsi: lahan.provinsi || "",
        kodePos: lahan.kodePos || "",
        latitude: lahan.latitude || 0,
        longitude: lahan.longitude || 0,
      },
      tanaman: lahan.tanaman,
    }));

    return NextResponse.json({
      success: true,
      data: dataLahanFormatted,
      message: `Berhasil mengambil ${dataLahanFormatted.length} data lahan`,
    });
  } catch (error: unknown) {
    console.error("GET Lahan Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data lahan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parsedBody = {
      ...rawBody,
      luasHektar: Number(rawBody.luasHektar),
      lokasi: rawBody.lokasi ? {
        ...rawBody.lokasi,
        latitude: Number(rawBody.lokasi.latitude || 0),
        longitude: Number(rawBody.lokasi.longitude || 0),
      } : undefined,
    };

    const validation = lahanSchema.safeParse(parsedBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data lahan tidak valid",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { nama, luasHektar, lokasi } = validation.data;

    const lahanBaru = await prisma.lahan.create({
      data: {
        petaniId: session.user.id,
        nama,
        luasHektar: Number(luasHektar),
        jalan: lokasi?.jalan || "",
        kelurahan: lokasi?.kelurahan || "",
        kecamatan: lokasi?.kecamatan || "",
        kabupaten: lokasi?.kabupaten || "",
        provinsi: lokasi?.provinsi || "",
        kodePos: lokasi?.kodePos || "",
        latitude: lokasi?.latitude ? Number(lokasi.latitude) : 0,
        longitude: lokasi?.longitude ? Number(lokasi.longitude) : 0,
      },
      include: {
        tanaman: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: lahanBaru,
      message: "Lahan berhasil ditambahkan",
    });
  } catch (error: unknown) {
    console.error("POST Lahan Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambah lahan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
