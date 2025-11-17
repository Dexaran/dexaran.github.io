import Button, { ButtonColor, ButtonSize } from "@/components/atoms/Button";

export default function HowItWorksPage() {
  return (
    <div className="max-w-[680px] mx-auto flex-grow">
      <h1 className="gap-1 text-28 md:text-40 font-medium mb-2 mt-6 md:mt-10 text-center">
        ERC-223
      </h1>
      <p className="text-secondary-text text-center mb-3 md:mb-8 px-4">
        ERC-223 is an advanced Ethereum token standard built to enhance the functionality and safety
        of token transfers compared to ERC-20. It addresses common issues such as token loss,
        improves efficiency by reducing gas costs, and ensures smoother, more secure transactions.
      </p>

      <div className="px-4">
        <a target="_blank" href="https://dexaran.github.io/erc223">
          <Button
            mobileSize={ButtonSize.MEDIUM}
            colorScheme={ButtonColor.LIGHT_GREEN}
            fullWidth
            endIcon="forward"
          >
            ERC-223 front page
          </Button>
        </a>
      </div>
    </div>
  );
}
