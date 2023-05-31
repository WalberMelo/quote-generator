import "@/styles/globals.css";
import type { AppProps } from "next/app";

// AWS imports
import { Amplify } from "aws-amplify";
import awsmobile from "../src/aws-exports";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
