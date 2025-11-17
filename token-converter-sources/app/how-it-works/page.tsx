function HowItWorksStep({ step, text, title }: { step: number; text: string; title: string }) {
  return (
    <div className="py-4 md:py-8 card-spacing-x grid grid-cols-[40px_1fr] md:gap-3 gap-x-3 gap-y-1 rounded-5 bg-tertiary-bg">
      <div>
        <div className="bg-quaternary-bg rounded-full w-10 h-10 flex items-center justify-center">
          {step}
        </div>
      </div>
      <div className="font-medium top-1.5 md:top-0 relative text-18 md:text-24">{title}</div>
      <div />
      <div className="text-secondary-text">{text}</div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-[680px] mx-auto">
      <h1 className="gap-1 text-28 md:text-40 font-medium mb-2 mt-6 md:mt-10 text-center">
        How it works
      </h1>
      <p className="text-secondary-text text-center mb-3 md:mb-8 px-4">
        Converting tokens from the ERC-20 standard to the ERC-223 standard opens up new
        possibilities for enhanced security and functionality. This process allows you to transition
        your tokens to a more advanced standard that aligns with modern security principles and
        provides improved error handling capabilities. Let&apos;s explore how this conversion works
        step by step.
      </p>

      <div className="card-spacing-x card-spacing-y rounded-5 bg-primary-bg flex flex-col gap-5">
        <HowItWorksStep
          step={1}
          text={
            "Connect your Ethereum wallet to the chosen conversion platform. This wallet should hold the ERC-20 tokens you wish to convert. Ensure that your wallet is secure and well-protected before proceeding"
          }
          title={"Connect your wallet"}
        />
        <HowItWorksStep
          step={2}
          text={
            "On the conversion platform, specify the amount of ERC-20 tokens you want to convert to ERC-223. The platform will guide you through the process, asking for details such as the token contract address, the desired recipient address for the converted tokens, and any other relevant information."
          }
          title={"Specify conversion details"}
        />
        <HowItWorksStep
          step={3}
          text={
            "Carefully review the conversion details to ensure accuracy. Once you're satisfied with the provided information, confirm the conversion request. At this stage, the platform may also display the conversion rate, allowing you to see how many ERC-223 tokens you'll receive for the specified amount of ERC-20 tokens."
          }
          title={"Confirm conversion"}
        />
        <HowItWorksStep
          step={4}
          text={
            "Connect your Ethereum wallet to the chosen conversion platform. This wallet should hold the ERC-20 tokens you wish to convert. Ensure that your wallet is secure and well-protected before proceeding"
          }
          title={"Receive ERC-223 tokens"}
        />
      </div>
    </div>
  );
}
