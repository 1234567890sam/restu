import QRCode from "qrcode";

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

// Generate Base64 Data URL for display
export async function generateQRDataURL(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    width: options?.width || 512,
    margin: options?.margin !== undefined ? options?.margin : 2,
    color: {
      dark: options?.color?.dark || "#000000",
      light: options?.color?.light || "#ffffff",
    },
    errorCorrectionLevel: options?.errorCorrectionLevel || "H",
  };

  return await QRCode.toDataURL(text, qrOptions);
}

// Generate SVG string for vector printing
export async function generateQRSVG(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  const qrOptions: QRCode.QRCodeToStringOptions = {
    type: "svg",
    width: options?.width || 512,
    margin: options?.margin !== undefined ? options?.margin : 2,
    color: {
      dark: options?.color?.dark || "#000000",
      light: options?.color?.light || "#ffffff",
    },
    errorCorrectionLevel: options?.errorCorrectionLevel || "H",
  };

  return await QRCode.toString(text, qrOptions);
}

export function getBaseUrl(): string {
  // In the browser, always use current actual origin
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  // If NEXT_PUBLIC_APP_URL is explicitly set to a production domain
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  // Vercel auto-provided system variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// Get the public URL for a restaurant menu
export function getMenuUrl(slug: string, table?: string | number): string {
  const baseUrl = getBaseUrl();
  try {
    const url = new URL(`/r/${slug}`, baseUrl);
    if (table) {
      url.searchParams.set("table", String(table));
    }
    return url.toString();
  } catch {
    const clean = baseUrl.replace(/\/$/, "");
    return `${clean}/r/${slug}${table ? `?table=${table}` : ""}`;
  }
}
