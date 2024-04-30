import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { QueryProvider } from "@/apis/QueryProvider";
import { AppConfig } from "@/config";
import Header from "@/components/header";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
    <html lang="en">
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
            <ReactQueryDevtools initialIsOpen={false} />
            <Snackbars />
          </ThemeProviderWrapper>
        </QueryProvider>
      </StoreProvider>
    </RootLayout>
  );
};

export default App;
