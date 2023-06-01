import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

// Components
import {
  BackgroundImage1,
  BackgroundImage2,
  FooterContainer,
  FooterLink,
  GradientBackgroundComponent,
  QuoteGeneratorButton,
  QuoteGeneratorButtonText,
  QuoteGeneratorContainer,
  QuoteGeneratorInnerContainer,
  QuoteGeneratorSubTitle,
  QuoteGeneratorTitle,
} from "@/components/QuoteGenerator/QuoteGenerator";

// Assets
import cloudImg from "../assets/cloud.png";
import quotesImg from "../assets/quotes.png";

//GraphQL
import { GraphQLQuery, GraphQLResult } from "@aws-amplify/api";
import { quoteQueryName } from "@/src/graphql/queries";
// AWS
import { API } from "aws-amplify";

// interface for out DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quoteGenerated: number;
  createdAt: string;
  updateAt: string;
}
// type-guard for our fetch function
function isGraphQLResultForQuotesQueryName(
  response: any
): response is GraphQLResult<{
  quoteQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return (
    response.data &&
    response.data.quoteQueryName &&
    response.data.quoteQueryName.items
  );
}

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  // function to fetch our DynamoDB object (quotes generates)
  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<GraphQLQuery<UpdateQuoteInfoData>>({
        query: quoteQueryName,
        authMode: "AWS_IAM",
        variables: {
          queryName: "LIVE",
        },
      });
      console.log("response", response.data);

      // Create type guards
      if (!isGraphQLResultForQuotesQueryName(response)) {
        throw new Error("Unexpected response from API.graphql");
      }

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      const receivedNumberOfQuotes =
        response.data.quoteQueryName.items[0].quoteGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);
    } catch (error) {
      console.log("error getting quote data", error);
    }
  };

  useEffect(() => {
    updateQuoteInfo();
  }, []);

  return (
    <>
      <Head>
        <title>Inspiration Quote Generator</title>
        <meta name="description" content="Amazing project to generate quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background */}
      <GradientBackgroundComponent>
        {/* Quote Generator Modal Pop-up*/}
        {/* <QuoteGeneratorModal /> */}
        {/* Quote Generator */}
        <QuoteGeneratorContainer>
          <QuoteGeneratorInnerContainer>
            <QuoteGeneratorTitle>
              Daily inspiration Generator
            </QuoteGeneratorTitle>
            <QuoteGeneratorSubTitle>
              Looking for a splash of inspiration? Generate a quote card with a
              random inspiration quote provided by {""}
              <FooterLink
                href="https://zenquotes.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ZenQuotes API
              </FooterLink>
            </QuoteGeneratorSubTitle>
            <QuoteGeneratorButton>
              <QuoteGeneratorButtonText
              //onClick={null}
              >
                Make a Quote
              </QuoteGeneratorButtonText>
            </QuoteGeneratorButton>
          </QuoteGeneratorInnerContainer>
        </QuoteGeneratorContainer>

        <BackgroundImage1
          src={quotesImg}
          height="300"
          alt="surf wetsuit"
          priority={true}
        />
        <BackgroundImage2 src={cloudImg} height="300" alt="surf vest" />
      </GradientBackgroundComponent>

      {/* Footer */}
      <FooterContainer>
        <>
          Quotes Generated: {numberOfQuotes}
          <br />
          Developer with ♥️ by{" "}
          <FooterLink
            href="https://www.walbermelo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Walber Melo
          </FooterLink>
        </>
      </FooterContainer>
    </>
  );
}
