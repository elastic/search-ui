import * as Searchkit from "@searchkit/sdk"; // searchkit@3 sdk uses CommonJS modules by default

const { CustomQuery } = Searchkit;

export const EngineQuery = () =>
  new CustomQuery({
    queryFn: (query) => {
      return {
        bool: {
          must: [
            {
              query_string: {
                query: query
              }
            }
          ]
        }
      };
    }
  });
