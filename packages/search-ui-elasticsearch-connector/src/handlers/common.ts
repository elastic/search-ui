import { AutocompletedResult, SearchResult } from "@elastic/search-ui";
import { SearchkitHit } from "@searchkit/sdk";

export function fieldResponseMapper(
  item: SearchkitHit
): SearchResult | AutocompletedResult {
  const fields = item.fields;
  const highlights = item.highlight || {};
  const combinedFieldKeys = [
    ...new Set(Object.keys(fields).concat(Object.keys(highlights)))
  ];
  return combinedFieldKeys.reduce(
    (acc, key) => {
      return {
        ...acc,
        [key]: {
          ...(fields[key] ? { raw: fields[key] } : {}),
          ...(highlights[key] ? { snippet: highlights[key] } : {})
        }
      };
    },
    {
      id: { raw: item.id }
    }
  );
}
