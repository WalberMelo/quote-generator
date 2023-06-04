import React, { useEffect, useState } from "react";
import Head from "next/head";

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

import QuoteGeneratorModal from "@/components/QuoteGenerator";

// Assets
import cloudImg from "../assets/cloud.png";
import quotesImg from "../assets/quotes.png";

//GraphQL
import { GraphQLQuery, GraphQLResult } from "@aws-amplify/api";
import { generateQuote, quoteQueryName } from "@/src/graphql/queries";
// AWS
import { API } from "aws-amplify";

// interface  for out appsync <> lambda JSON response
interface GenerateQuoteData {
  generateQuote: {
    statusCode: number;
    header: { [key: string]: string };
    body: string;
  };
}

// interface for our DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quoteGenerated: number;
  createdAt: string;
  updatedAt: string;
}

// type guard for our fetch function
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
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

  // function for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
    setProcessingQuote(false);
    setQuoteReceived(null);
  };

  const handleOpenGenerator = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
    try {
      // Run Lambda Function
      const runFunction = "runFunction";
      const runFunctionStringified = JSON.stringify(runFunction);
      const response = await API.graphql<GenerateQuoteData>({
        query: generateQuote,
        authMode: "AWS_IAM",
        variables: {
          input: runFunctionStringified,
        },
      });

      const responseStringified = JSON.stringify(response);
      const responseReStringified = JSON.stringify(responseStringified);
      const bodyIndex = responseReStringified.indexOf("body=") + 5;
      const bodyAndBase64 = responseReStringified.substring(bodyIndex);
      const bodyArray = bodyAndBase64.split(",");
      const body = bodyArray[0];
      console.log(body);
      setQuoteReceived(body);

      // End state
      setProcessingQuote(false);

      // Fetch if any new quotes were generated from counter
      updateQuoteInfo();
    } catch (error) {
      console.log("error generating quote:", error);
      setProcessingQuote(false);
    }
  };

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
      //console.log("response", response.data);

      // Create type guards
      if (!isGraphQLResultForQuotesQueryName(response)) {
        throw new Error("Unexpected response from API.graphql");
      }

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      // !TODO: Check why numbers of quotes is not updating
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

        <QuoteGeneratorModal
          open={openGenerator}
          close={handleCloseGenerator}
          processingQuote={processingQuote}
          setProcessingQuote={setProcessingQuote}
          quoteReceived={quoteReceived}
          setQuoteReceived={setQuoteReceived}
        />
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
            <QuoteGeneratorButton onClick={handleOpenGenerator}>
              <QuoteGeneratorButtonText>Make a Quote</QuoteGeneratorButtonText>
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
