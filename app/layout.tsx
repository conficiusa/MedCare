import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";
import Navbar from "@/components/blocks/navbar";
import Footer from "@/components/blocks/footer";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/wrappers/sessionProvider";
// import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/wrappers/providers";
import { ThemeProvider } from "@/lib/theme-provider";
  import { pipeline } from "@huggingface/transformers";
import TanstackProvider from "@/components/wrappers/tanstackProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "contain",
};

const isProduction = process.env.NODE_ENV === "production";
export const metadata: Metadata = {
  metadataBase: isProduction
    ? new URL("https://medcare-hub.vercel.app")
    : new URL("http://localhost:3000"),
  title: {
    template: "%s | Medcare hub",
    default: "Medcare hub",
  },
  description:
    "Connect with highly skilled doctors at the comfort of your home",
  keywords: [
    "Telemedicine",
    "Healthcare",
    "Doctors",
    "Patients",
    "Medcare Hub",
    "Medcare",
    "Consultation",
    "Online Consultation",
    "Virtual Consultation",
  ],
  authors: [{ name: "Medcare Hub", url: "medcare-hub.vercel.app" }],

  openGraph: {
    type: "website",
    url: "https://medcare-hub.vercel.app",
    title: "Medcare Hub",
    description:
      "Connect with highly skilled doctors at the comfort of your home",
    images: [
      {
        url: "/HeroPic.webp",
        width: 800,
        height: 600,
        alt: "Medcare Hub",
      },
      {
        url: "/authPic.jpg",
        width: 900,
        height: 800,
        alt: "Medcare Hub",
      },
    ],
  },
  verification: {
    google: "Qex2I5k01ZN8QezjCTqKq9xe_1HlSi-T_jrm66DCqQI",
  },
};
export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <Providers>
          <TanstackProvider>
            <body className={cn("antialiased w-full", inter.className)}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                <main role="main">
                  {modal}
                  {children}
                  <Toaster />
                  {/* <Analytics /> */}
                </main>
                <Footer />
              </ThemeProvider>
            </body>
          </TanstackProvider>
        </Providers>
      </AuthProvider>
    </html>
  );
}
