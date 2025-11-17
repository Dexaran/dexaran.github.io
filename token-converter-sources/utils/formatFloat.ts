export function formatFloat(
  value: number | string,
  options?: {
    significantDigits?: number;
    trimZero?: boolean;
  },
) {
  const numberValue = Number(value);
  const maximumSignificantDigits = options?.significantDigits ?? 2;

  if (numberValue < 1e-10) {
    if (options?.trimZero || numberValue === 0) {
      return "0";
    }

    return "< 0.0001";
  }

  if (numberValue < 1) {
    return numberValue.toLocaleString("en-US", {
      maximumSignificantDigits: maximumSignificantDigits,
    });
  } else {
    const _value = numberValue.toFixed(maximumSignificantDigits);
    if (options?.trimZero) {
      return _value.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
    return _value;
  }
}

export function formatNumber(num: string, maxPrecision = 15) {
  const [integerPart] = num.toString().split(".");

  if (integerPart.length >= maxPrecision) {
    // If the integer part alone exceeds or matches the precision, return it as-is
    return parseFloat(num)
      .toPrecision(maxPrecision)
      .replace(/\.?0+$/, "");
  } else {
    // Limit the total length to maxPrecision
    const precisionNeeded = maxPrecision - integerPart.length;
    return parseFloat(num)
      .toPrecision(precisionNeeded)
      .replace(/\.?0+$/, "");
  }
}

export function formatNumberKilos(
  num: number,
  options?: {
    significantDigits?: number;
    trimZero?: boolean;
  },
): string {
  if (num < 1000) {
    return formatFloat(num, options); // Numbers less than 1000 remain as is.
  }

  const suffixes = ["K", "M", "B", "T"]; // Thousand, Million, Billion, Trillion
  let power = Math.floor(Math.log10(num) / 3); // Determine the power of 1000
  power = Math.min(power, suffixes.length); // Ensure it doesn't exceed defined suffixes
  const scaled = num / Math.pow(1000, power);

  return scaled.toFixed(options?.significantDigits ?? 2).replace(/\.0$/, "") + suffixes[power - 1];
}
