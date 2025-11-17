import { SCALING_FACTOR } from "@/config/baseFeeMultipliers";

export function addPercentsToBigInt(value: string | bigint, percent: number): bigint {
  const bigintValue = typeof value === "string" ? BigInt(value) : value;

  return (bigintValue * BigInt(100 + percent)) / SCALING_FACTOR;
}

export function add10PercentsToBigInt(value: string | bigint) {
  return addPercentsToBigInt(value, 10);
}
