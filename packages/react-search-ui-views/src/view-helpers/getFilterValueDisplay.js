export default function getFilterValueDisplay(filterValue) {
  if (!filterValue) return "";
  if (filterValue.hasOwnProperty("name")) return filterValue.name;
  return String(filterValue);
}
