export interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: T[];
}
