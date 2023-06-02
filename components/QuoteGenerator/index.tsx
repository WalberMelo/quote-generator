import { useEffect, useState } from "react";

// Material UI Imports
import { Backdrop, Fade, Modal } from "@mui/material";
import {
  ModalCircularProgress,
  QuoteGeneratorModalContainer,
  QuoteGeneratorModalInnerContainer,
  QuoteGeneratorSubTitle,
  QuoteGeneratorTitle,
} from "./QuoteGenerator";
import ImageBlob from "../animations/ImageBlob";
import { ImageBlobContainer } from "../animations/AnimationsElements";
import AnimatedDownloadButton from "../../components/animations/AnimatedDownloadButton";

interface QuoteGeneratorModalProps {
  open: boolean;
  close: () => void;
  processingQuote: boolean;
  quoteReceived: String | null;
  setProcessingQuote: React.Dispatch<React.SetStateAction<boolean>>;
  setQuoteReceived: React.Dispatch<React.SetStateAction<String | null>>;
}

//! TODO: Style QuoteGeneratorModalContainer
const style = {};

const QuoteGeneratorModal = ({
  open,
  close,
  processingQuote,
  quoteReceived,
  setProcessingQuote,
  setQuoteReceived,
}: QuoteGeneratorModalProps) => {
  const wiseDevQuote = '"If you can keep calm, anything is possible"';
  const wiseDevQuoteAuthor = "Walber Melo";

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Function: Handling the download of quote card
  const handleDownload = () => {
    const link = document.createElement("a");
    if (typeof blobUrl === "string") {
      link.href = blobUrl;
      link.download = "quote.png";
      link.click();
    }
  };

  // Function: Handling to receiving of quote card
  useEffect(() => {
    if (quoteReceived) {
      const binaryData = Buffer.from(quoteReceived, "base64");
      const blob = new Blob([binaryData], { type: "image/png" });
      const blobUrlGenerated = URL.createObjectURL(blob);
      setBlobUrl(blobUrlGenerated);

      return () => {
        URL.revokeObjectURL(blobUrlGenerated);
      };
    }
  }, [quoteReceived]);

  return (
    <Modal
      id="QuoteGeneratorModal"
      arial-labelledby="spring-modal-quote-generator-modal"
      aria-describedby="spring-modal-opens-and-closes-quote-generator"
      open={open}
      onClose={close}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <QuoteGeneratorModalContainer sx={style}>
          <QuoteGeneratorModalInnerContainer>
            {/* State #1 Processing request of quote + quote state is empty */}
            {processingQuote === true && quoteReceived === null && (
              <>
                <ModalCircularProgress size={"8rem"} thickness={2.5} />
                <QuoteGeneratorTitle>
                  Creating your quote...
                </QuoteGeneratorTitle>
                <QuoteGeneratorSubTitle style={{ marginTop: "20px" }}>
                  {wiseDevQuote}
                  <br></br>
                  <span style={{ fontSize: 26 }}>{wiseDevQuoteAuthor}</span>
                </QuoteGeneratorSubTitle>
              </>
            )}
            {/* State #2 Quote state fulfilled */}
            {quoteReceived === null && (
              <>
                <QuoteGeneratorTitle>Download your quote!</QuoteGeneratorTitle>
                <QuoteGeneratorSubTitle style={{ marginTop: "20px" }}>
                  See a preview:
                </QuoteGeneratorSubTitle>
                <ImageBlobContainer>
                  <ImageBlob quoteReceived={quoteReceived} blobUrl={blobUrl} />
                </ImageBlobContainer>
                <AnimatedDownloadButton handleDownload={handleDownload} />
              </>
            )}
          </QuoteGeneratorModalInnerContainer>
        </QuoteGeneratorModalContainer>
      </Fade>
    </Modal>
  );
};

export default QuoteGeneratorModal;
