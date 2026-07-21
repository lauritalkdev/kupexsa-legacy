import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  APP_NAME,
  SCHOOL_NAME,
} from "@/lib/constants";


export const metadata: Metadata = {
  title: APP_NAME,
  description:
    `The digital home of Kupexsans worldwide - ${SCHOOL_NAME}`,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body>

        <Navbar />

        <main>
          {children}
        </main>

        <Footer />

      </body>

    </html>
  );
}