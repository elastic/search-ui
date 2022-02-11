export type SearchResponse = {
  record_count?: number;
  records?: Record<string, any>;
  info?: Record<string, any>;
  errors?: Record<string, string[]>;
};
