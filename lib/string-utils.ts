export function snakeCaseToTitleCase(str: string) {
  const words = str.split("_");
  const titleCaseArr = words.map(
    (word) => word[0].toUpperCase() + word.slice(1),
  );

  return titleCaseArr.join(" ");
}
