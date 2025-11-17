import { Address } from "viem";

import { DexChainId } from "@/config/networks.config";
import { Standard } from "@/config/standard.config";
import getExplorerLink, { ExplorerLinkType } from "@/utils/getExplorerLink";

import Svg from "./Svg";
import Tooltip from "./Tooltip";

export default function TokenAddressWithStandard({
  tokenAddress,
  standard,
  chainId,
}: {
  tokenAddress: Address;
  standard: Standard;
  chainId: DexChainId;
}) {
  return (
    <div className="flex text-10">
      <Tooltip
        renderTrigger={(ref, refProps) => (
          <div
            onClick={(e) => e.stopPropagation()}
            ref={ref.setReference}
            {...refProps}
            className="whitespace-nowrap border rounded-l-2 border-secondary-border bg-quaternary-bg px-2 flex items-center text-secondary-text cursor-pointer"
          >
            {standard}
          </div>
        )}
        iconSize={16}
        text={
          standard === Standard.ERC20
            ? 'ERC-20 is a token standard on Ethereum network. It specifies the "version" of the token you are going to use.'
            : 'ERC-223 is an alternative token standard on Ethereum network. It specifies the "version" of the token you are going to use. ERC-223 introduces security improvements and gas optimizations not available with ERC-20.'
        }
      />

      <a
        href={getExplorerLink(ExplorerLinkType.ADDRESS, tokenAddress, chainId)}
        target="_blank"
        className="bg-quaternary-bg pl-2 pr-1 flex gap-1 py-px text-secondary-text hover:text-primary-text
         hover:bg-green-bg duration-200 border border-secondary-border rounded-r-2 items-center border-l-0"
      >
        {tokenAddress && `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-6)}`}
        <Svg size={16} iconName="forward" />
      </a>
    </div>
  );
}
