// TODO: We shouldn't expose this, we should just allow a user
// to pass configuration to Provider and create this automatically
export { SearchDriver } from "@elastic/search-ui";
export { default as withSearch } from "./withSearch";
export { default as SearchConsumer } from "./SearchConsumer";
export { default as SearchProvider } from "./SearchProvider";

export * from "./containers";
