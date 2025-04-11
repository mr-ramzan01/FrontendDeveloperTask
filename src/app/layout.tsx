'use client'
import Banner from "@/components/common/Banner";
import "./globals.css";

import { Source_Sans_3 } from 'next/font/google';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";

const sourceSans = Source_Sans_3({
  weight: '400',
  subsets: ['latin'], // or other desired subsets
  display: 'swap', // or other desired display options
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <head>
        // add head tags here
      </head> */}
      <body className={`${sourceSans.className} bg-[#17181E] text-white`}>
        <SessionProvider>
          <Provider store={store}>
            <Banner>
              {children}
            </Banner>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
