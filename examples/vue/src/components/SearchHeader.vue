<template>
  <div class="sui-layout-header">
    <div class="sui-layout-header__inner">
      <form @submit.prevent="$emit('submit', $event.target.value)">
        <div class="sui-search-box">
          <div class="sui-search-box__wrapper">
            <input
              type="text"
              placeholder="Try searching for 'water', 'dragon' or 'ragnaros'"
              class="sui-search-box__text-input"
              :value="value"
              @input="$emit('input', $event.target.value)"
            />
          </div>
          <input
            type="submit"
            class="button sui-search-box__submit"
            value="Search"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: String
    }
  }
};
</script>
