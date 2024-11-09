import type { Metadata } from "next";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "rutIA",
  description: "App per a generar rutes per Barcelona",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cat">
      <body>
        {children}
      </body>
    </html>
  );
}
