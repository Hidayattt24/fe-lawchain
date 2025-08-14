import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SplashProvider } from "@/contexts/SplashContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppWrapper from "@/components/AppWrapper";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SplashProvider>
            <AppWrapper>{children}</AppWrapper>
          </SplashProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
