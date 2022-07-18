<template>
  <div class="sui-sorting">
    <div class="sui-sorting__label">Sort by</div>
    <select
      name="sortBy"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">Relevance</option>
      <option value="name">Name</option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"]
};
</script>
