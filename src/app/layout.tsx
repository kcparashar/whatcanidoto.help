import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Turn climate dread, war headlines, and everyday overwhelm into one useful next action.";

export const metadata: Metadata = {
  metadataBase: new URL("https://whatcanidoto.help"),
  applicationName: "whatcanidoto.help",
  title: {
    default: "whatcanidoto.help",
    template: "%s | whatcanidoto.help",
  },
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "whatcanidoto.help",
    description,
    url: "/",
    siteName: "whatcanidoto.help",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "whatcanidoto.help turns heavy feelings into useful action.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "whatcanidoto.help",
    description,
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    title: "whatcanidoto.help",
  },
  category: "social good",
};

const themeInitScript = `
(() => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("whatcanidoto-theme="))
      ?.split("=")[1];
    const theme =
      cookie === "paper" || cookie === "blueprint"
        ? cookie
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "blueprint"
          : "paper";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "blueprint" ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = "paper";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
