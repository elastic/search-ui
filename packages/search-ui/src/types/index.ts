export type SortList = {

}

export type SortDirection = "asc" | "desc"

export type FilterClause = "any" | "all" | "none"

export type FilterValue = any

export type Filter = {
	field: string
}

export type SearchState = {
	
}

export type AutocompleteQuery = {
	results?,
	suggestions?
}
  
  // todo: types
export type SearchQuery = {
	filters?: any
	conditionalFacets?: any
	facets?: any
	disjunctiveFacets?: any
	disjunctiveFacetsAnalyticsTags?: any
	result_fields?: any
	search_fields?: any
}