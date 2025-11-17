export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    throw new Error("Clipboard API not supported");
  }
}
