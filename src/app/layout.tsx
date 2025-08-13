import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SplashProvider } from "@/contexts/SplashContext";
import AppWrapper from "@/components/AppWrapper";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LawChain",
  description: "Blockchain technology for legal solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <SplashProvider>
          <AppWrapper>{children}</AppWrapper>
        </SplashProvider>
      </body>
    </html>
  );
}
