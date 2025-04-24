
export const getHitSuggestion = async (
  query: string,
  fields: string[],
  hits,
  size = 5
) => {
  let highlight;
  hits.highlightedFields?.forEach((field) => {
    if (!highlight) {
      highlight = { fields: {} };
    }
    if (typeof field == "string") {
      highlight.fields[field] = {};
    } else {
      highlight.fields[field.field] = field.config;
    }
  });

  return {
    size,
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query,
              type: "bool_prefix",
              fields
            }
          }
        ]
      }
    },
    _source: {
      includes: hits.fields
    },
    highlight
  };
};

export const getCompletionSuggestions = (
  field: string,
  query: string,
  size = 5
) => ({
  size: 0,
  _source: [],
  suggest: {
    suggest: {
      prefix: query,
      completion: {
        size: size,
        skip_duplicates: true,
        field,
        fuzzy: {
          fuzziness: 1
        }
      }
    }
  }
});

//   const response = await transport.performRequest(eql, { index });

//   return {
//     identifier: identifier,
//     suggestions: response.suggest.suggest[0].options.map(
//       (suggestion) => suggestion.text
//     )
//   };
