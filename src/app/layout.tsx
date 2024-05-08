import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { QueryProvider } from "@/apis/QueryProvider";
import { AppConfig } from "@/config";
import Header from "@/components/header";
import StoreProvider from "@/stores";
import Snackbars from "@/components/snackbars";
import ThemeProviderWrapper from "@/components/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${AppConfig.name}`,
  description: `${AppConfig.description}`,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      {/*
      TODO: proper prefetch in nextjs
      <link
        rel="preload"
        href="/data/buff/buffids.json"
        as="fetch"
        crossOrigin="anonymous"
      /> */}
      <body className={inter.className}>{children}</body>
    </html>
  );
};

type Props = {
  children: React.ReactNode;
};

const App: React.FC<Props> = ({ children }) => {
  return (
    <RootLayout>
      <StoreProvider>
        <QueryProvider>
          <ThemeProviderWrapper>
            <div className="app">
              <Header />
              {children}
            </div>
            <Snackbars />
          </ThemeProviderWrapper>
        </QueryProvider>
      </StoreProvider>
    </RootLayout>
  );
};

export default App;
