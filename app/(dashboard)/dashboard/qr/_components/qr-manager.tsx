"use client";

import { useState, useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/database.types";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { ColorPicker } from "@/app/_components/ui/color-picker";
import { generateQRDataURL, getMenuUrl } from "@/lib/qr";
import { Download, Printer, Copy, Check, QrCode, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QRManagerProps {
  restaurant: Restaurant;
  initialMenuUrl?: string;
}

export function QRManager({ restaurant, initialMenuUrl }: QRManagerProps) {
  const [tableNumber, setTableNumber] = useState<string>("");
  const [qrColor, setQrColor] = useState<string>(restaurant.theme_color || "#0f172a");
  const [qrBgColor, setQrBgColor] = useState<string>("#ffffff");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Client-side dynamic menu URL initialized with server value for clean hydration
  const [menuUrl, setMenuUrl] = useState<string>(
    initialMenuUrl || getMenuUrl(restaurant.slug, undefined)
  );

  useEffect(() => {
    setMenuUrl(getMenuUrl(restaurant.slug, tableNumber || undefined));
  }, [restaurant.slug, tableNumber]);

  useEffect(() => {
    let isMounted = true;
    generateQRDataURL(menuUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: qrColor,
        light: qrBgColor,
      },
    }).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [menuUrl, qrColor, qrBgColor]);

  const copyUrl = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success("Menu URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPNG = () => {
    const link = document.createElement("a");
    link.download = `${restaurant.slug}-qr${tableNumber ? `-table-${tableNumber}` : ""}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR Code downloaded as PNG!");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            QR Code Generator & Table Stands
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate high-resolution QR codes for physical table tents, coasters, and restaurant entrances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="no-print">
            <Printer className="w-4 h-4 mr-2" />
            Print Table Card
          </Button>
          <Button variant="primary" onClick={downloadPNG} className="no-print">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: QR Customization Controls */}
        <div className="lg:col-span-6 space-y-6 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Menu Destination</CardTitle>
              <CardDescription>
                Live URL embedded inside the QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                  {menuUrl}
                </div>
                <Button variant="outline" size="sm" onClick={copyUrl}>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div>
                <Input
                  label="Table Number (Optional)"
                  placeholder="e.g. 5, or VIP-1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  hint="When customer scans, this table number will automatically appear on their menu"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Styling & Colors</CardTitle>
              <CardDescription>
                Customize colors to match your restaurant brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPicker
                label="QR Code Color"
                value={qrColor}
                onChange={setQrColor}
                description="Dark colors work best for quick smartphone camera scanning"
              />

              <div className="pt-2">
                <ColorPicker
                  label="Background Color"
                  value={qrBgColor}
                  onChange={setQrBgColor}
                  presetColors={["#ffffff", "#f8fafc", "#fef3c7", "#fdf2f8"]}
                  description="Keep light for maximum camera contrast"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Formats</CardTitle>
              <CardDescription>
                Download in formats ready for local graphic designers & print shops
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={downloadPNG}
              >
                <Download className="w-4 h-4" />
                PNG (512x512)
              </Button>

              <a
                href={`/api/qr?url=${encodeURIComponent(menuUrl)}&format=svg&color=${encodeURIComponent(qrColor)}&bg=${encodeURIComponent(qrBgColor)}&download=true&filename=${restaurant.slug}-qr`}
                download
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  SVG (Vector)
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Table Tent Stand Preview (Printable area) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 no-print">
            Live Table Stand Preview (A6 / 4x6" card format)
          </div>

          <div
            ref={printRef}
            id="printable-table-card"
            className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 text-center flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden"
          >
            {/* Top Bar Branding */}
            <div className="w-full space-y-2">
              <div
                className="w-12 h-1.5 rounded-full mx-auto"
                style={{ backgroundColor: qrColor }}
              />
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {restaurant.name}
              </h2>
              {tableNumber ? (
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: qrColor }}
                >
                  Table #{tableNumber}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  {restaurant.tagline || "Solapur's Favourite Dining"}
                </p>
              )}
            </div>

            {/* QR Centerpiece */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex flex-col items-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Menu"
                  className="w-48 h-48 object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-300 animate-pulse" />
                </div>
              )}
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Scan with Camera</span>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="w-full pt-2 border-t border-slate-100 text-slate-500 space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Contactless Digital Food Menu
              </p>
              <p className="text-[11px] text-slate-600 font-mono font-medium truncate px-2 py-0.5 rounded bg-slate-100/80 inline-block max-w-full">
                {menuUrl ? menuUrl.replace(/^https?:\/\//, "") : `menurestu.vercel.app/r/${restaurant.slug}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
