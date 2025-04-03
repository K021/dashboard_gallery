import { exec } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  const { path: inputPath } = await request.json();

  if (!inputPath || typeof inputPath !== "string") {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  console.log("inputPath", inputPath);

  try {
    const resolvedPath = path.resolve(process.cwd(), "public", inputPath.replace(/^\/+/, ""));
    console.log("resolvedPath", resolvedPath);
    exec(`open -R "${resolvedPath}"`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
