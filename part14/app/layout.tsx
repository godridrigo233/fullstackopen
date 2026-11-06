import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: {
    default: "Full Stack Open Blog",
    template: "%s | Full Stack Open Blog",
  },
  description: "A blog application built with Next.js, Drizzle, and PostgreSQL.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <NotificationProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
