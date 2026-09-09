import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const format = searchParams.get("format") || "png"; // 'png' | 'svg'
  const color = searchParams.get("color") || "#000000";
  const bg = searchParams.get("bg") || "#ffffff";
  const size = parseInt(searchParams.get("size") || "512", 10);
  const download = searchParams.get("download") === "true";
  const filename = searchParams.get("filename") || "restaurant-qr";

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    if (format === "svg") {
      const svgString = await QRCode.toString(url, {
        type: "svg",
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bg,
        },
        errorCorrectionLevel: "H",
      });

      const headers = new Headers();
      headers.set("Content-Type", "image/svg+xml");
      if (download) {
        headers.set(
          "Content-Disposition",
          `attachment; filename="${filename}.svg"`
        );
      }

      return new NextResponse(svgString, { status: 200, headers });
    } else {
      const buffer = await QRCode.toBuffer(url, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bg,
        },
        errorCorrectionLevel: "H",
      });

      const headers = new Headers();
      headers.set("Content-Type", "image/png");
      if (download) {
        headers.set(
          "Content-Disposition",
          `attachment; filename="${filename}.png"`
        );
      }

      return new NextResponse(buffer as unknown as BodyInit, { status: 200, headers });
    }
  } catch (err: any) {
    return new NextResponse(`Error generating QR: ${err.message}`, {
      status: 500,
    });
  }
}
