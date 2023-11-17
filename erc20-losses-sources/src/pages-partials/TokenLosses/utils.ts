// import { excludedMap } from "./const"

/**
 * Formats a number with commas (e.g. 123,234,660.12)
 *
 * @param {number} x - The number to be formatted.
 * @return {string} The formatted number as a string.
 */
export function numberWithCommas(x: number) {
    if (x < 0.000001) return '0.00'
    const parts = x.toString().split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2)
    }
    return parts.join(".")
}

export const handleExclusions = (result: any, excludedMap: any) =>
  result.map((token) => {
    if (excludedMap.has(token.tokenAddress.toLowerCase())) {
      const excluded: string[] = excludedMap.get(token.tokenAddress.toLowerCase()) || [];
      if (excluded.length < 1) {
        return token;
      }
      const records = token.records.map((record) => {
        if (excluded.includes(record.contract.toLowerCase())) {
          return {
            ...record,
            exclude: true,
          };
        } else {
          return record;
        }
      });
      const amount = records.reduce((acc, record) => {
        if (record.exclude) {
          return acc;
        } else {
          return acc + record.roundedAmount;
        }
      }, 0);
      const asDollar = amount * token.price;

      return {
        ...token,
        records,
        asDollar,
        amount,
      };
    } else {
      return token;
    }
  });
