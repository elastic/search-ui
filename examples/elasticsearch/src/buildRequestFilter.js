function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === "false" || fieldValue === "true") {
    return { [field]: fieldValue === "true" };
  }

  return { [`${field}.keyword`]: fieldValue };
}

function getTermFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: [
          filter.values.map(filterValue => ({
            term: getTermFilterValue(filter.field, filterValue)
          }))
        ],
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: [
          filter.values.map(filterValue => ({
            term: getTermFilterValue(filter.field, filterValue)
          }))
        ]
      }
    };
  }
}

function getRangeFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: [
          filter.values.map(filterValue => ({
            range: {
              [filter.field]: {
                ...(filterValue.to && { lt: filterValue.to }),
                ...(filterValue.to && { gt: filterValue.from })
              }
            }
          }))
        ],
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: [
          filter.values.map(filterValue => ({
            range: {
              [filter.field]: {
                ...(filterValue.to && { lt: filterValue.to }),
                ...(filterValue.to && { gt: filterValue.from })
              }
            }
          }))
        ]
      }
    };
  }
}

export default function buildRequestFilter(filters) {
  if (!filters) return;

  filters = filters.reduce((acc, filter) => {
    if (["states", "world_heritage_site"].includes(filter.field)) {
      return [...acc, getTermFilter(filter)];
    }
    if (["acres", "visitors"].includes(filter.field)) {
      return [...acc, getRangeFilter(filter)];
    }
    return acc;
  }, []);

  if (filters.length < 1) return;
  return filters;

  // [
  //   {
  //     "field": "states",
  //     "values": [
  //       "California"
  //     ],
  //     "type": "any"
  //   },
  //   {
  //     "field": "world_heritage_site",
  //     "values": [
  //       "false"
  //     ],
  //     "type": "all"
  //   },
  //   {
  //     "field": "visitors",
  //     "values": [
  //       {
  //         "to": 10000,
  //         "from": 0,
  //         "name": "0 - 10000"
  //       }
  //     ],
  //     "type": "all"
  //   },
  //   {
  //     "field": "acres",
  //     "values": [
  //       {
  //         "to": 1000,
  //         "from": 0,
  //         "name": "Small"
  //       }
  //     ],
  //     "type": "all"
  //   }
  // ]
  //
  //
  // "filter": [
  //   {
  //     "bool": {
  //       "should": [
  //         {
  //           "term": {
  //             "states.keyword": "California"
  //           }
  //         },
  //         {
  //           "term": {
  //             "states.keyword": "Nevada"
  //           }
  //         }
  //       ],
  //       "minimum_should_match": 1
  //     }
  //   },
  //   {
  //     "bool": {
  //       "filter": [
  //         {
  //           "term": {
  //             "world_heritage_site": false
  //           }
  //         }
  //       ]
  //     }
  //   }
  // ]
}
