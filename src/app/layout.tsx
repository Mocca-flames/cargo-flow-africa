import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import NavBar from "@/components/nav/NavBar";
import LoadingScreen from "@/components/loading/LoadingScreen";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Cargo Flow Africa",
  description: "Heavy-haulage logistics across Africa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LoadingScreen>
          <NavBar />
          {children}
        </LoadingScreen>
      </body>
    </html>
  );
}
