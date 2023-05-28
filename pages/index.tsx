import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { GradientBackgroundComponent } from "@/components/QuoteGenerator/QuoteGenerator";

export default function Home() {
  return (
    <>
      <Head>
        <title>Inspiration Quote Generator</title>
        <meta name="description" content="Amazing project to generate quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GradientBackgroundComponent></GradientBackgroundComponent>
    </>
  );
}
