import Image from "next/image";

import { basePath } from "@/config/build/paths";
import { Standard } from "@/config/standard.config";
import { TwoStandardToken } from "@/types/Token";

import TokenAddressWithStandard from "../atoms/TokenAddressWithStandard";

// interface Props {
//   tokenA: Currency | undefined;
//   tokenB: Currency | undefined;
// }
// export default function SelectedTokensInfo({ tokenA, tokenB }: Props) {
//   if (!tokenA && !tokenB) {
//     return null;
//   }
//
//   if (tokenA && tokenB && tokenA.equals(tokenB)) {
//     return (
//       <div className="w-full bg-primary-bg p-4 sm:p-6 grid gap-3 rounded-5">
//         <SelectedTokenInfoItem token={tokenA} />
//       </div>
//     );
//   }
//
//   return (
//     <div className="w-full bg-primary-bg p-4 sm:p-6 grid gap-3 rounded-5">
//       {tokenA && <SelectedTokenInfoItem token={tokenA} />}
//       {tokenB && <SelectedTokenInfoItem token={tokenB} />}
//     </div>
//   );
// }

function AddressPair({ token }: { token: TwoStandardToken }) {
  return (
    <div className="flex gap-2 flex-col md:flex-row">
      <TokenAddressWithStandard
        tokenAddress={token.address0}
        standard={Standard.ERC20}
        chainId={token?.chainId}
      />
      <TokenAddressWithStandard
        tokenAddress={token.address1}
        standard={Standard.ERC223}
        chainId={token.chainId}
      />
    </div>
  );
}
export default function SelectedTokenInfoItem({ token }: { token: TwoStandardToken }) {
  return (
    <div className="bg-tertiary-bg pt-2.5 pb-3.5 px-5 @container relative z-20 rounded-3">
      <div className="flex justify-between gap-x-4">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap flex-grow gap-2">
          <div className="flex items-center gap-2">
            <img
              src={token.logoURI || `${basePath}/images/tokens/placeholder.svg`}
              alt="Ethereum"
              className="flex-shrink-0 w-8 h-8"
            />
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <div className="table table-fixed w-full">
                  <span className="table-cell overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {token.name}
                  </span>
                </div>
              </div>
              <div className="text-secondary-text text-12">
                <div className="table table-fixed w-full">
                  <span className="table-cell overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {token.symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-2">
        <AddressPair token={token} />
      </div>
    </div>
  );
}
