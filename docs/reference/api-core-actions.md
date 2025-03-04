---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-core-actions.html
---

# Actions [api-core-actions]

To update the state, you can use actions below. Actions are functions that update the Request State and performs an API request.

```js
setSearchTerm("search term");
```

To get access to the actions within your component, you must wrap your component with our context HOCs.

```jsx
// Selects `searchTerm` and `setSearchTerm` for use in Component
withSearch(({ searchTerm, setSearchTerm }) => ({
  searchTerm,
  setSearchTerm
}))(Component);
```

See [WithSearch & withSearch](/reference/api-react-with-search.md) for more information.

There are certain cases where you may need to apply one or more actions at a time. Search UI intelligently batches actions into a single API call.

For example, if you need to apply two filters at once, it is perfectly acceptable to write the following code:

```js
addFilter("states", "Alaska", "any");
addFilter("world_heritage_site", "true");
```

This will only result in a single API call.


## addFilter [api-core-actions-addfilter]

```ts
addFilter(
  name: string,
  value: FilterValue,
  type: FilterType = "all"
)
```

Add a filter in addition to current filters values.


### Examples [api-core-actions-examples]

```js
addFilter("states", "Alaska");
addFilter("isPublished", true);
addFilter("rating", 1);

addFilter("states", ["Alaska", "California"], "all");
addFilter("states", ["Alaska", "California"], "any");

addFilter("published",{
  name: "published",
  from: "2020-01-01",
  to: "2020-12-31"
});

addFilter("rating",{
  name: "badRating",
  from: 1,
  to: 6
});
```


### Parameters [api-core-actions-parameters-1]

| Parameters | description |
| --- | --- |
| `name` | Required. Name of the field |
| `value` | Required. Filter Value. See `FilterValue` type. |
| `type` | Optional. Defaults to `all`. How the filter is applied. Can be one of `any`, `all`, `none` |


## setFilter [api-core-actions-setfilter]

```js
setFilter(
  name: string,
  value: FilterValue,
  type: FilterType = "all"
)
```

Set a filter value, replacing current filter values.


### Examples [api-core-actions-examples-2]

```js
setFilter("states", "Alaska");
setFilter("isPublished", true);
setFilter("rating", 1);

setFilter("states", ["Alaska", "California"], "all");
setFilter("states", ["Alaska", "California"], "any");

setFilter("published",{
  name: "published",
  from: "2020-01-01",
  to: "2020-12-31"
});

setFilter("rating",{
  name: "badRating",
  from: 1,
  to: 6
});
```


### Parameters [api-core-actions-parameters-3]

| Parameters | description |
| --- | --- |
| `name` | Required. Name of the field |
| `value` | Required. Filter Value. See `FilterValue` type. |
| `type` | Optional. Defaults to `all`. How the filter is applied. Can be one of `any`, `all`, `none` |


## removeFilter [api-core-actions-removefilter]

Removes filters or filter values.

```js
removeFilter(
  name: string,
  value?: FilterValue,
  type?: FilterType
)
```


### Examples [api-core-actions-examples-4]

```js
removeFilter("states");
removeFilter("states", ["Alaska", "California"]);

removeFilter("published", {
  name: "published",
  from: "2020-01-01",
  to: "2020-12-31"
});

removeFilter("rating", {
  name: "badRating",
  from: 1,
  to: 6
});
```


### Parameters [api-core-actions-parameters-5]

| Parameters | description |
| --- | --- |
| `name` | Required. Name of the field |
| `value` | Optional. Filter Value. Will remove all filters under field if value not specified. See `FilterValue` type. |
| `type` | Optional. Defaults to `all`. How the filter is applied. Can be one of `any`, `all`, `none` |


## reset [api-core-actions-reset]

Reset state to initial search state.

```js
reset();
```


## clearFilters [api-core-actions-clearfilters]

Clear all filters.

```js
clearFilters((except: string[] = []));
```


### Examples [api-core-actions-examples-6]

```js
clearFilters();
clearFilters(["states"]); // field name
```


### Parameters [api-core-actions-parameters-7]

| Parameters | description |
| --- | --- |
| `except` | Optional. String array. Field names which you want to ignore being cleared. |


## setCurrent [api-core-actions-setcurrent]

Update the current page number. Used for paging.

```js
setCurrent(current: number)
```


### Examples [api-core-actions-examples-8]

```js
setCurrent(2);
```


### Parameters [api-core-actions-parameters-9]

| Parameters | description |
| --- | --- |
| `current` | Required. Number type. The page number. |


## setResultsPerPage [api-core-actions-setresultsperpage]

Update the number of results per page. Used for paging.

```js
setResultsPerPage(resultsPerPage: number)
```


### Examples [api-core-actions-examples-10]

```js
setResultsPerPage(20);
```


### Parameters [api-core-actions-parameters-11]

| Parameters | description |
| --- | --- |
| `resultsPerPage` | Required. Number type. Sets number of results per page. |


## setSearchTerm [api-core-actions-setsearchterm]

```js
setSearchTerm(
  searchTerm: string,
  {
    autocompleteMinimumCharacters = 0,
    autocompleteResults = false,
    autocompleteSuggestions = false,
    shouldClearFilters = true,
    refresh = true,
    debounce = 0
  }: SetSearchTermOptions = {}
)
```

Update the search term. Also gives you the ability to control autocomplete options.


### Examples [api-core-actions-examples-12]

```js
setSearchTerm("train");
```


### Parameters [api-core-actions-parameters-13]

| Parameters | description |
| --- | --- |
| `searchTerm` | Required. String type. the new search term to query by |
| `options` | Optional. Object type. See `SetSearchTermOptions` type. |


### SetSearchTermOptions Parameters [api-core-actions-setsearchtermoptions-parameters]

| Parameters | description |
| --- | --- |
| `autocompleteMinimumCharacters` | Optional. miniumum terms to start performing autocomplete suggestions |
| `autocompleteResults` | Optional. To perform autocomplete Results |
| `autocompleteSuggestions` | Optional. To perform autocomplete Suggestions |
| `shouldClearFilters` | Optional. To clear filters |
| `refresh` | Optional. To refresh results |
| `debounce` | Optional. |


## setSort [api-core-actions-setsort]

```js
setSort(
  sort: SortOption[] | string,
  sortDirection: SortDirection
)
```

Update the sort option.


### Parameters [api-core-actions-parameters-14]

| Parameters | description |
| --- | --- |
| `sort` | `SortOption` or String - field to sort on |
| `sortDirection` | String - "asc" or "desc" |


## trackClickThrough [api-core-actions-trackclickthrough]

```js
trackClickThrough(
  documentId: string,
  tags: string[] = []
)
```

Report a clickthrough event, which is when a user clicks on a result link.


### Parameters [api-core-actions-parameters-15]

| Parameters | description |
| --- | --- |
| `documentId` | String - The document ID associated with the result that was clicked |
| `tags` | Optional. Array[String] Optional tags which can be used to categorize this click event |


## trackAutocompleteClickThrough [api-core-actions-trackautocompleteclickthrough]

```js
trackAutocompleteClickThrough(
  documentId: string,
  tags: string[] = []
)
```

Report a clickthrough event, which is when a user clicks on an autocomplete suggestion.


### Parameters [api-core-actions-parameters-16]

| Parameters | description |
| --- | --- |
| `documentId` | String - The document ID associated with the result that was clicked |
| `tags` | Optional. Array[String] Optional tags which can be used to categorize this click event |


## trackAutocompleteSuggestionClickThrough [api-core-actions-trackautocompletesuggestionclickthrough]

::::{note}
**This action requires the use of the analytics plugin.**

::::


```js
trackAutocompleteSuggestionClickThrough(
  suggestion: string,
  postion: number
  tags: string[] = []
)
```

Report a suggestion clickthrough event, which is when a user clicks on an autocomplete suggestion.


### Parameters [api-core-actions-parameters-17]

| Parameters | description |
| --- | --- |
| `suggestion` | String - The suggestion that was clicked |
| `position` | Number - The position of the suggestion that was clicked |
| `tags` | Optional. Array[String] Optional tags which can be used to categorize this click event |


## a11yNotify [api-core-actions-a11ynotify]

```js
a11yNotify(
  messageFunc: string,
  messageArgs?: unknown
)
```

Reads out a screen reader accessible notification. See `a11yNotificationMessages` under TODO LINK


### Parameters [api-core-actions-parameters-18]

| Parameters | description |
| --- | --- |
| `messageFunc` | String - object key to run as function |
| `messageArgs` | Object - Arguments to pass to form your screen reader message string |


## Types [api-core-actions-types-19]


### FilterValue & FilterType Types [api-core-actions-filtervalue-and-filtertype-types]

`FilterValue` can be either a value type or a range type.


#### Types [api-core-actions-types-20]

```ts
type FilterValue = FilterValueValue | FilterValueRange;

type FieldValue = string | number | boolean | Array<string | number | boolean>;

type FilterValueValue = FieldValue;

type FilterValueRange = {
  from?: FieldValue;
  name: string;
  to?: FieldValue;
};

type FilterType = "any" | "all" | "none";
```

