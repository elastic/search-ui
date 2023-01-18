import { CustomQuery } from "@searchkit/sdk";

export const EngineQuery = (fields) =>
  new CustomQuery({
    queryFn: (query) => {
      return {
        bool: {
          must: [
            {
              combined_fields: {
                query: query,
                fields: fields
              }
            }
          ]
        }
      };
    }
  });
