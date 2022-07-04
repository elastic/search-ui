<template>
  <div class="sui-results-per-page">
    <div class="sui-results-per-page__label">Show</div>
    <select
      name="resultsPerPage"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
      <option :value="20">20</option>
      <option :value="40">40</option>
      <option :value="60">60</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  }
};
</script>
