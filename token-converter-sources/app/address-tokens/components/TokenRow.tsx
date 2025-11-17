import { Address, isAddress } from "viem";

import Badge, { BadgeVariant } from "@/components/atoms/Badge";
import IconButton, {
  ClickableAreaSize,
  IconButtonSize,
  IconButtonVariant,
  IconSize,
} from "@/components/atoms/IconButton";
import { Standard } from "@/config/standard.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import useTokenBalances from "@/hooks/useTokenBalances";
import { TwoStandardToken } from "@/types/Token";
import { formatFloat } from "@/utils/formatFloat";
import getExplorerLink, { ExplorerLinkType } from "@/utils/getExplorerLink";
import truncateMiddle from "@/utils/truncateMiddle";

export default function TokenRow({
  token,
  onDelete,
  accountAddress,
}: {
  token: TwoStandardToken;
  onDelete: () => void;
  accountAddress: Address | string;
}) {
  const { balance } = useTokenBalances(
    token,
    isAddress(accountAddress) ? accountAddress : undefined,
  );
  const chainId = useCurrentChainId();

  return (
    <div className="flex flex-col md:grid md:grid-cols-[144fr_168fr_168fr_48fr] rounded-3 bg-quaternary-bg py-4 max-md:px-4 max-md:gap-3">
      <div className="max-md:flex max-md:justify-between max-md:items-center">
        <div className="flex items-center gap-2 md:pl-5">
          <img className="w-6 md:w-8 h-6 md:h-8" src={token.logoURI} alt="" />
          {token.symbol}
        </div>
        <span className="md:hidden relative">
          <IconButton
            iconSize={IconSize.REGULAR}
            buttonSize={IconButtonSize.EXTRA_SMALL}
            clickableAreaSize={ClickableAreaSize.LARGE}
            variant={IconButtonVariant.DELETE}
            handleDelete={onDelete}
          />
        </span>
      </div>
      <div className="flex flex-col max-md:px-4 max-md:rounded-3 max-md:bg-tertiary-bg max-md:pt-2.5 max-md:pb-1">
        <span className="flex items-center gap-1">
          {formatFloat(balance?.erc20Balance?.formatted || 0)}{" "}
          <span className="text-secondary-text">{token.symbol}</span>
          <span className="md:hidden">
            <Badge variant={BadgeVariant.STANDARD} standard={Standard.ERC20} color="purple" />{" "}
          </span>
        </span>
        <div className="flex items-center gap-1">
          <a
            className="text-underline text-green hover:text-[#A5E7C5] duration-200"
            href={getExplorerLink(ExplorerLinkType.TOKEN, token.address0, chainId)}
          >
            {truncateMiddle(token.address0)}
          </a>
          <IconButton
            iconSize={IconSize.REGULAR}
            buttonSize={IconButtonSize.SMALL}
            variant={IconButtonVariant.COPY}
            text={token.address0}
          />
        </div>
      </div>
      <div className="flex flex-col max-md:px-4 max-md:rounded-3 max-md:bg-tertiary-bg max-md:pt-2.5 max-md:pb-1">
        <span className="flex items-center gap-1">
          {formatFloat(balance?.erc223Balance?.formatted || 0)}{" "}
          <span className="text-secondary-text">{token.symbol}</span>
          <span className="md:hidden">
            <Badge variant={BadgeVariant.STANDARD} standard={Standard.ERC223} color="green" />{" "}
          </span>
        </span>
        <div className="flex items-center gap-1">
          <a
            className="text-underline text-green hover:text-[#A5E7C5] duration-200"
            href={getExplorerLink(ExplorerLinkType.TOKEN, token.address1, chainId)}
          >
            {truncateMiddle(token.address1)}
          </a>
          <IconButton
            iconSize={IconSize.REGULAR}
            buttonSize={IconButtonSize.SMALL}
            variant={IconButtonVariant.COPY}
            text={token.address1}
          />
        </div>
      </div>
      <div className="flex items-center max-md:hidden">
        <IconButton
          iconSize={IconSize.REGULAR}
          buttonSize={IconButtonSize.LARGE}
          variant={IconButtonVariant.DELETE}
          handleDelete={onDelete}
        />
      </div>
    </div>
  );
}
