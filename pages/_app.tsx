import "@/styles/globals.scss";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextComponentType } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthGuard from "../components/AuthGuard";
import PageLayout from "../components/PageLayout";

export type CustomAppProps = AppProps & {
  Component: NextComponentType & { requireAuth?: boolean };
};

export const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <SessionProvider
            session={session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus
          >
            {Component?.requireAuth ? (
              <AuthGuard>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
            <ReactQueryDevtools position="bottom-right" />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
