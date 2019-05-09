function totalPages(resultsPerPage, totalResults) {
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}

function getInfo(hits, resultsPerPage) {
  const totalResults = hits.total.value;
  return {
    totalPages: resultsPerPage ? totalPages(resultsPerPage, totalResults) : 0,
    totalResults
  };
}

function getHighlight(hit, fieldName) {
  if (hit._source.title === "Rocky Mountain" && fieldName === "title") {
    console.log(hit);
    window.hit = hit;
    console.log(fieldName);
    window.fieldName = fieldName;
  }
  if (
    !hit.highlight ||
    !hit.highlight[fieldName] ||
    hit.highlight[fieldName].length < 1
  ) {
    return;
  }

  return hit.highlight[fieldName][0];
}

function getResults(hits) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value
  });

  const toObject = (value, snippet) => {
    return { raw: value, ...(snippet && { snippet }) };
  };

  return hits.map(record => {
    return Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObject(fieldValue, getHighlight(record, fieldName))
      ])
      .reduce(addEachKeyValueToObject, {});
  });
}

function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "value",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count
        }))
      }
    ];
  }
}

function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "range",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key
          },
          count: bucket.doc_count
        }))
      }
    ];
  }
}

function getFacets(aggregations) {
  const states = getValueFacet(aggregations, "states");
  const world_heritage_site = getValueFacet(
    aggregations,
    "world_heritage_site"
  );
  const visitors = getRangeFacet(aggregations, "visitors");
  const acres = getRangeFacet(aggregations, "acres");

  const facets = {
    ...(states && { states }),
    ...(world_heritage_site && { world_heritage_site }),
    ...(visitors && { visitors }),
    ...(acres && { acres })
  };

  if (Object.keys(facets).length > 0) {
    return facets;
  }
}

export default function buildState(response, resultsPerPage) {
  const results = getResults(response.hits.hits);
  const info = getInfo(response.hits, resultsPerPage);
  const facets = getFacets(response.aggregations);

  return {
    results,
    ...info,
    ...(facets && { facets })
  };
}
