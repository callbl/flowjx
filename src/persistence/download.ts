/**
 * Downloads a text file to the user's browser.
 * Creates a Blob, generates a temporary URL, triggers download, then revokes URL.
 */
export function downloadTextFile({
  filename,
  text,
  mimeType = "application/json",
}: {
  filename: string;
  text: string;
  mimeType?: string;
}) {
  // Create a Blob from the text content
  const blob = new Blob([text], { type: mimeType });

  // Generate a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Clean up the temporary URL
  URL.revokeObjectURL(url);
}
