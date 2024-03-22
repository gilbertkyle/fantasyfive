import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Provider } from "~/app/_providers/QueryProvider";

import Navbar from "~/app/_components/Navbar";
import "ag-grid-enterprise";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "FantasyFive FFL",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider>
        <html lang="en">
          <body className={`font-sans ${inter.variable}`}>
            <Toaster />
            <Navbar />
            {children}
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
