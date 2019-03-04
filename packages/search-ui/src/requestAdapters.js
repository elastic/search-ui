function removeName(v) {
  if (v && v.name) {
    // eslint-disable-next-line
    const { name, ...rest } = v;
    return {
      ...rest
    };
  }

  return v;
}

function rollup(f) {
  // TODO Move this to the app search connector and just say "app search connector"
  // doesn't support this feature.
  let values;
  if (f.values[0] && typeof f.values[0] === "object") {
    values = removeName(f.values[0]);
  } else {
    values = f.values.map(removeName);
  }

  return {
    [f.field]: values
  };
}

export function adaptFilters(filters) {
  if (!filters || filters.length === 0) return {};
  const all = filters.filter(f => f.type === "all").map(rollup);
  return {
    all
  };
}
