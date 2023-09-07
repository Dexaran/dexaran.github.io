import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import styles from "./HowItWorks.module.scss";
import clsx from "clsx";

const HowItWorksContent = {
  title: "How it works",
  description:
    "Converting tokens from the ERC-20 standard to the ERC-223 standard opens up new possibilities for enhanced security and functionality. This process allows you to transition your tokens to a more advanced standard that aligns with modern security principles and provides improved error handling capabilities. Let's explore how this conversion works step by step.",
  steps: [
    {
      title: "Connect Your Wallet",
      description:
        "Connect your Ethereum wallet to the chosen conversion platform. This wallet should hold the ERC-20 tokens you wish to convert. Ensure that your wallet is secure and well-protected before proceeding.",
    },
    {
      title: "Specify Conversion Details",
      description:
        "On the conversion platform, specify the amount of ERC-20 tokens you want to convert to ERC-223. The platform will guide you through the process, asking for details such as the token contract address, the desired recipient address for the converted tokens, and any other relevant information.",
    },
    {
      title: "Confirm Conversion",
      description:
        "Carefully review the conversion details to ensure accuracy. Once you're satisfied with the provided information, confirm the conversion request. At this stage, the platform may also display the conversion rate, allowing you to see how many ERC-223 tokens you'll receive for the specified amount of ERC-20 tokens.",
    },
    {
      title: "Receive ERC-223 Tokens",
      description:
        "Once the conversion is complete and confirmed by the blockchain, the platform will release the converted ERC-223 tokens to your specified recipient address. These tokens are now compliant with the ERC-223 standard, offering improved security and error handling capabilities.",
    },
  ],
};
export const HowItWorks = () => {
  return (
    <>
      <div className={styles.contentBlockHeader}>
        <h1 className={clsx(homeStyles.h1, styles.h1)}>{HowItWorksContent.title}</h1>
        <p className={clsx(homeStyles.description, styles.description)}>
          {HowItWorksContent.description}
        </p>
        {HowItWorksContent.steps.map((step, index) => (
          <div key={step.title} className={styles.step}>
            <div className={styles.stepNumber}>
              <span>{index + 1}</span>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
