export default function buildResponseAdapterOptions(config = {}) {
  const additionalFacetValueFields = Object.entries(config.facets || {}).reduce(
    (acc, [fieldName, facetConfig]) => {
      if (facetConfig.unit && facetConfig.center) {
        return {
          ...(acc || {}),
          [fieldName]: {
            ...(facetConfig.unit && { unit: facetConfig.unit }),
            ...(facetConfig.center && { center: facetConfig.center })
          }
        };
      }

      return acc;
    },
    null
  );

  return {
    ...(additionalFacetValueFields && { additionalFacetValueFields })
  };
}
