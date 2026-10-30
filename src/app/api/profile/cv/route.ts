
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(
      new URL("/login", request.url),
      { status: 303 },
    );
  }

  if (session.user.role !== "CANDIDATE") {
    return NextResponse.redirect(
      new URL("/jobs", request.url),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("cv");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.redirect(
      new URL("/profile?cvError=file", request.url),
      { status: 303 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.redirect(
      new URL("/profile?cvError=size", request.url),
      { status: 303 },
    );
  }

  if (
    file.type !== "application/pdf" ||
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return NextResponse.redirect(
      new URL("/profile?cvError=type", request.url),
      { status: 303 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (bytes.subarray(0, 5).toString() !== "%PDF-") {
    return NextResponse.redirect(
      new URL("/profile?cvError=type", request.url),
      { status: 303 },
    );
  }

  const fileName = `${randomUUID()}.pdf`;
  const uploadDirectory = path.join(process.cwd(), "uploads", "cv");
  const filePath = path.join(uploadDirectory, fileName);

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(filePath, bytes, { flag: "wx" });

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        cvUrl: fileName,
      },
    });
  } catch {
    const { unlink } = await import("node:fs/promises");
    await unlink(filePath).catch(() => {});
    throw new Error("Nie udało się zapisać informacji o CV.");
  }

  return NextResponse.redirect(
    new URL("/profile?cvUploaded=1", request.url),
    { status: 303 },
  );
}
