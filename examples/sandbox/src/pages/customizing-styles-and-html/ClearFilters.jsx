import { useSearch } from "@elastic/react-search-ui";

export const ClearFilters = () => {
  const { filters, clearFilters } = useSearch();

  return (
    <div>
      <button onClick={() => clearFilters()}>
        Clear {filters.length} Filters
      </button>
    </div>
  );
};
