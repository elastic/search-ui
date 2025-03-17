import type { AutocompletedResult, SearchResult } from "@elastic/search-ui";
import type { SearchkitHit } from "@searchkit/sdk";

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
          ...(key in fields ? { raw: fields[key] } : {}),
          ...(key in highlights ? { snippet: highlights[key] } : {})
        }
      };
    },
    {
      id: { raw: item.id },
      _meta: {
        id: item.rawHit._id,
        rawHit: item.rawHit
      }
    }
  );
}
