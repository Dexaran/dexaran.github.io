export default function truncateMiddle(
  value: string,
  options: {
    charsFromStart: number;
    charsFromEnd: number;
  } = { charsFromStart: 6, charsFromEnd: 6 },
) {
  if (value.length < options.charsFromStart + options.charsFromEnd) return value;
  return `${value.slice(0, options.charsFromStart)}...${options.charsFromEnd > 0 ? value.slice(-options.charsFromEnd) : ""}`;
}
