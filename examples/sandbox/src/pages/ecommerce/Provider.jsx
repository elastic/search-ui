import { SearchProvider } from "@elastic/react-search-ui";

export const Provider = ({ config, children }) => {
  return <SearchProvider config={config}>{children}</SearchProvider>;
};
