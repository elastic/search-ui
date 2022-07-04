<template>
  <ul class="sui-results-container search-section__search-results">
    <li
      v-for="result in results"
      :key="result.id.raw"
      class="search-section__search-result"
    >
      <SearchResult :result="result" />
    </li>
  </ul>
</template>

<script>
import SearchResult from "./SearchResult";

export default {
  components: {
    SearchResult
  },
  props: {
    results: {
      type: Array,
      required: true
    }
  }
};
</script>

<style>
.search-section__search-results {
  display: flex;
  flex-wrap: wrap;
}

.search-section__search-result {
  width: 48%;
  margin: 1%;
  background: white;
}
</style>
