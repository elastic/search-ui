import SearchkitModule from "../SearchkitModule";

const { CustomQuery } = SearchkitModule;

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
