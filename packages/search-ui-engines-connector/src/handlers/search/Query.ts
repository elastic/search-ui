import { CustomQuery } from "@searchkit/sdk";

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
