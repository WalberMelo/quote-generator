import Image from "next/image";
import React from "react";
Image;
import lottieJson from "../../assets/animated-photo.json.json";
import {
  CenteredLottie,
  DownloadQuoteCardConText,
  DownloadQuoteCardContainer,
} from "./AnimationsElements";

interface AnimatedDownloadButtonProps {
  handleDownload: () => void;
}

const AnimatedDownloadButton = ({
  handleDownload,
}: AnimatedDownloadButtonProps) => {
  return (
    <DownloadQuoteCardContainer onClick={handleDownload}>
      <CenteredLottie loop animationData={lottieJson} play />
      <DownloadQuoteCardConText>
        Download your quote card
      </DownloadQuoteCardConText>
    </DownloadQuoteCardContainer>
  );
};

export default AnimatedDownloadButton;
