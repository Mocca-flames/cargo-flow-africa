import type { Metadata, Viewport } from "next";
import NavBar from "@/components/nav/NavBar";
import LoadingScreen from "@/components/loading/LoadingScreen";
import "./globals.css";

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
    <html lang="en">
      <body>
        <LoadingScreen>
          <NavBar />
          {children}
        </LoadingScreen>
      </body>
    </html>
  );
}
