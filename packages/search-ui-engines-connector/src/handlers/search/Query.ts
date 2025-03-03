import * as SearchkitModule from "@searchkit/sdk"; // searchkit@3 sdk uses CommonJS modules by default

const {
 CustomQuery
} =
  typeof SearchkitModule.default === "object"
    ? (SearchkitModule.default as unknown as typeof SearchkitModule)
    : SearchkitModule as typeof SearchkitModule;

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
