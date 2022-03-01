import * as express from "express";
import { handleAutocompleteRequest, handleSearchRequest } from "../core";

type SearchUIConnectorOptions = {
  apiPath?: string;
  host: string;
  index: string;
  queryFields: string[];
};

function SearchUIConnector(options: SearchUIConnectorOptions) {
  return function SearchUIRoutes(app: express.Application) {
    const apiPath = options.apiPath || "/api";
    app.post(
      `${apiPath}/search`,
      async (req: express.Request, res: express.Response) => {
        const { state, queryConfig } = req.body;
        const response = await handleSearchRequest(
          state,
          queryConfig,
          options.host,
          options.index,
          options.queryFields
        );
        res.json(response);
      }
    );

    app.post(
      `${apiPath}/autocomplete`,
      async (req: express.Request, res: express.Response) => {
        const { state, queryConfig } = req.body;
        const response = await handleAutocompleteRequest(
          state,
          queryConfig,
          options.host,
          options.index,
          options.queryFields
        );
        res.json(response);
      }
    );
  };
}

export default SearchUIConnector;
