import Image from "next/image";

import { basePath } from "@/config/build/paths";

const emptyStateIconUrlMap = {
  assets: `${basePath}/images/empty/empty-assets.svg`,
  edit: `${basePath}/images/empty/empty-edit.svg`,
  history: `${basePath}/images/empty/empty-history.svg`,
  imported: `${basePath}/images/empty/empty-imported.svg`,
  list: `${basePath}/images/empty/empty-list.svg`,
  pair: `${basePath}/images/empty/empty-pair.svg`,
  pool: `${basePath}/images/empty/empty-pool.svg`,
  search: `${basePath}/images/empty/empty-search.svg`,
  "search-list": `${basePath}/images/empty/empty-search-list.svg`,
  wallet: `${basePath}/images/empty/empty-wallet.svg`,
  custom: `${basePath}/images/empty/empty-custom-tokens.svg`,
  tokens: `${basePath}/images/empty/empty-tokens.svg`,
  warning: `${basePath}/images/empty/empty-warning.svg`,
  autolisting: `${basePath}/images/empty/empty-autolisting.svg`,
  "deposited-tokens": `${basePath}/images/empty/empty-deposited-tokens.svg`,
  "margin-positions": `${basePath}/images/empty/empty-margin-positions.svg`,
  "lending-orders": `${basePath}/images/empty/empty-lending-orders.svg`,
  "search-autolisting": `${basePath}/images/empty/empty-autolisting-search.svg`,
};

type EmptyIconName = keyof typeof emptyStateIconUrlMap;

export default function EmptyStateIcon({
  iconName,
  size = 80,
}: {
  iconName: EmptyIconName;
  size?: number;
}) {
  return <Image width={size} height={size} src={emptyStateIconUrlMap[iconName]} alt="" />;
}
