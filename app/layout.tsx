import CommonLayout from "@/src/components/CommonLayout";
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MyApp",
  description: "Reusable layout with Navbar and Footer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}
