export type SortOption = {
	field: string,
	direction: SortDirection
}

export type SortDirection = "asc" | "desc"

export type FilterType = "any" | "all" | "none"

export type FieldValue = string | number | boolean | Array<string|number|boolean>

export type FilterValueValue = FieldValue

export type FilterValueRange = {
	from: FieldValue,
	name: string,
	to: FieldValue
}

export type FilterValue = FilterValueValue | FilterValueRange

export type FacetValue = {
	count: number,
	value: FilterValue,
	selected: boolean
}

export type FacetType = "range" | "value"

export type Facet = {
	data: FacetValue[],
	field: string,
	type: FacetType
}

export type Filter = {
	field: string
	type: FilterType
	values: FilterValue[]
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

export type APIConnector = {
	// search(query: SearchQuery): Promise<SearchResponse>
}

export type QueryConfig = {

}