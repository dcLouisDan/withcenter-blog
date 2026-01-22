export function snakeCaseToTitleCase(str: string): string {
  const words = str.split("_");
  const titleCaseArr = words.map(
    (word) => word[0].toUpperCase() + word.slice(1),
  );

  return titleCaseArr.join(" ");
}

export function titleToSlug(str: string): string {
  const cleanString = str.replace(/[^a-zA-Z0-9\s]/g, "");
  return cleanString
    .trim()
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-");
}

export function truncateString(str: string, limit: number): string {
  if (str.length <= limit) return str;
  return str.slice(0, limit).trim() + "...";
}
