import Web3Provider from "@/components/Web3Provider";
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "RandomLotto Draw | Fair & Fun On-Chain Lottery – $RLT",
  description:
    "RandomLotto Draw ($RLT) is a blockchain-powered lottery where players join with USDT for a chance to win big. Fair draws, transparent rules, and token rewards for every participant.",
  keywords:
    "RandomLotto, RLT, crypto lottery, USDT lottery, blockchain lottery, fair draw, random draw, Web3 gaming, Telegram lottery app, on-chain lottery, rewards",
  authors: [{ name: "RandomLotto Draw" }],
  creator: "RandomLotto Labs",
  publisher: "RandomLotto",
  robots: "index, follow",
  openGraph: {
    title: "RandomLotto Draw | Fair & Fun On-Chain Lottery – $RLT",
    description:
      "Join RandomLotto Draw – a transparent, blockchain-powered lottery. Participate with USDT, earn RLT tokens, and win prizes in fair random draws.",
    url: "https://randomlottodraw.com/",
    siteName: "RandomLotto Draw – $RLT",
    type: "website",
    images: [
      {
        url: "/og-randomlotto.png",
        width: 1200,
        height: 630,
        alt: "RandomLotto Draw – Blockchain Lottery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RandomLotto Draw | Fair & Fun On-Chain Lottery – $RLT",
    description:
      "RandomLotto Draw ($RLT) is a fair and transparent lottery powered by blockchain. Play with USDT, win prizes, and get rewarded in RLT tokens.",
    creator: "@RandomLottoDraw",
    images: ["/og-randomlotto.png"],
  },
  viewport:
    "width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover",
  category: "Blockchain Lottery",
  classification:
    "Crypto Lottery, USDT Draw, Web3 Gaming, Blockchain Rewards, Fair Lottery, Random Draw",
  other: {
    "application-name": "RandomLotto Draw",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
  icons: {
    icon: "/agent/agentlogo.png",
    shortcut: "/agent/agentlogo.png",
    apple: "/agent/agentlogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nova+Square&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0D0D0F] flex flex-col font-[Space_Grotesk]">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
