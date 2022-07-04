<template>
  <div class="sui-layout">
    <SearchHeader v-model="searchInputValue" @submit="handleFormSubmit" />
    <div v-if="searchState.wasSearched" class="sui-layout-body">
      <div class="sui-layout-body__inner">
        <div class="sui-layout-sidebar">
          <SearchSort v-show="thereAreResults" v-model="sortBy" />

          <SearchFacet
            :checked="cost"
            :facet="searchState.facets.cost[0]"
            @change="handleFacetChange($event, 'cost')"
          />

          <SearchFacet
            :checked="card_class"
            :facet="searchState.facets.card_class[0]"
            @change="handleFacetChange($event, 'card_class')"
          />

          <SearchFacet
            :checked="type"
            :facet="searchState.facets.type[0]"
            @change="handleFacetChange($event, 'type')"
          />

          <SearchFacet
            :checked="set"
            :facet="searchState.facets.set[0]"
            @change="handleFacetChange($event, 'set')"
          />

          <SearchFacet
            :checked="race"
            :facet="searchState.facets.race[0]"
            @change="handleFacetChange($event, 'race')"
          />

          <SearchFacet
            :checked="rarity"
            :facet="searchState.facets.rarity[0]"
            @change="handleFacetChange($event, 'rarity')"
          />
        </div>
        <div class="sui-layout-main">
          <div class="sui-layout-main-header">
            <div class="sui-layout-main-header__inner">
              <SearchPagingInfo :search-state="searchState" />
              <SearchResultsPerPage
                v-show="thereAreResults"
                v-model.number="resultsPerPage"
              />
            </div>
          </div>
          <div class="sui-layout-main-body">
            <SearchResults
              v-show="thereAreResults"
              :results="searchState.results"
            />
          </div>
          <div class="sui-layout-main-footer">
            <SearchPagination
              v-show="thereAreResults"
              :total-pages="Math.min(searchState.totalPages, 100)"
              :click-handler="setCurrentPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchDriver } from "@elastic/search-ui";
import config from "../searchConfig";
import SearchResults from "./SearchResults";
import SearchFacet from "./SearchFacet";
import SearchHeader from "./SearchHeader";
import SearchPagingInfo from "./SearchPagingInfo";
import SearchPagination from "./SearchPagination";
import SearchSort from "./SearchSort";
import SearchResultsPerPage from "./SearchResultsPerPage";

const driver = new SearchDriver(config);

export default {
  components: {
    SearchResults,
    SearchFacet,
    SearchHeader,
    SearchPagingInfo,
    SearchPagination,
    SearchSort,
    SearchResultsPerPage
  },
  data() {
    return {
      searchInputValue: "",
      searchState: {},
      race: [],
      rarity: [],
      type: [],
      set: [],
      card_class: [],
      cost: [],
      resultsPerPage: 20,
      sortBy: "relevance"
    };
  },
  computed: {
    thereAreResults() {
      return this.searchState.totalResults && this.searchState.totalResults > 0;
    }
  },
  watch: {
    resultsPerPage(newResultsPerPage) {
      driver.setResultsPerPage(newResultsPerPage);
    },
    sortBy(newSortBy) {
      driver.setSort(newSortBy, "asc");
    }
  },
  mounted() {
    const {
      searchTerm,
      sortField,
      resultsPerPage,
      filters,
      facets
    } = driver.getState();

    // restoring UI from url query
    this.searchInputValue = searchTerm;
    this.sortBy = sortField;
    this.resultsPerPage = resultsPerPage;
    filters.forEach(filter => {
      if (facets[filter.field][0].type === "range") {
        this[filter.field] = filter.values.map(value => value.name);
      } else {
        this[filter.field] = filter.values;
      }
    });

    driver.subscribeToStateChanges(state => {
      this.searchState = state;
    });
  },
  methods: {
    handleFormSubmit() {
      driver.getActions().setSearchTerm(this.searchInputValue);
    },
    handleFacetChange(event, facet) {
      const { value, checked } = event.target;
      const facetFromDriver = driver.getState().facets[facet][0];
      const valueforApi =
        facetFromDriver.type === "range"
          ? facetFromDriver.data.find(item => item.value.name === value).value
          : value;

      if (checked) {
        this[facet].push(value);
        driver.addFilter(facet, valueforApi, "any");
      } else {
        const index = this[facet].indexOf(value);
        if (index > -1) {
          this[facet].splice(index, 1);
        }
        driver.removeFilter(facet, valueforApi, "any");
      }
    },
    setCurrentPage(page) {
      driver.setCurrent(page);
    }
  }
};
</script>
