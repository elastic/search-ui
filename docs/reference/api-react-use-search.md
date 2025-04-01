---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-use-search.html
---

# useSearch hook [api-react-use-search]

In addition, to using `withSearch` you can now use `useSearch` hook in your custom react functional component.

## Usage

In order to use this hook, you should wrap your functional component in `SearchProvider`. We will see an example on how to use useSearch hook to render "loading" indicator when the application is fetching data.

```
const Component = () => {
  const { isLoading } = useSearch();
  return (
    <div className="App">
      {isLoading && <div>I'm loading now</div>}
      {!isLoading && (
        <Layout
          header={<SearchBox />}
          bodyContent={<Results titleField="title" urlField="nps_link" />}
        />
      )}
    </div>
  );
};
export const App = () => {
  return (
    <SearchProvider config={config}>
      <Component />
    </SearchProvider>
  );
};

```
