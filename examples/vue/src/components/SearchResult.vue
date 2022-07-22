<template>
  <article class="search-result">
    <h2 class="search-result__heading">{{ result.name.raw }}</h2>
    <div class="search-result__body">
      <img
        class="search-result__image"
        :src="imageSrc(result.id.raw)"
        :alt="result.name.raw"
      />
      <div class="search-result__data">
        <div v-if="result.type">Type: {{ result.type.raw }}</div>
        <div v-if="result.race">Race: {{ result.race.raw }}</div>
        <div v-else-if="result.card_class">
          Class: {{ result.card_class.raw }}
        </div>
        <div>Set: {{ result.set.raw }}</div>
        <div>Rarity: {{ result.rarity.raw }}</div>
        <br />
        <div v-if="result.cost">Cost: {{ result.cost.raw }}</div>
        <div v-if="result.attack">Attack: {{ result.attack.raw }}</div>
        <div v-if="result.durability">
          Durability: {{ result.durability.raw }}
        </div>
        <div v-if="result.health">Health: {{ result.health.raw }}</div>
        <div v-if="result.armor">Armor: {{ result.armor.raw }}</div>
        <div v-if="result.spell_damage">
          Spell damage: {{ result.spell_damage.raw }}
        </div>
        <div v-if="result.overload">Overload: {{ result.overload.raw }}</div>
        <br />
        <div v-if="result.artist">Artist: {{ result.artist.raw }}</div>
      </div>
    </div>
    <p class="search-result__flavor">{{ result.flavor.raw }}</p>
  </article>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  methods: {
    imageSrc(id) {
      return `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${id}.png`;
    }
  }
};
</script>

<style scoped>
.search-result {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  align-items: center;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-result__heading {
  text-align: center;
  margin: 0;
}

.search-result__body {
  display: flex;
  justify-content: flex-start;
  align-self: flex-start;
}

.search-result__data {
  padding-top: 50px;
}

.search-result__flavor {
  margin: 0;
}

.search-result__image {
  flex: none;
  width: 256px;
  height: 387px;
}
</style>
