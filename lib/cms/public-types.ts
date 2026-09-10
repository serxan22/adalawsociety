export type PublishedResult<T> = {
  posts: T[]; total: number; libraryTotal: number; page: number; pageSize: number;
  categories: string[]; authors: string[]; unavailable?: boolean;
};
export function emptyPublicationResult<T>(unavailable = false): PublishedResult<T> {
  return { posts: [], total: 0, libraryTotal: 0, page: 1, pageSize: 12, categories: [], authors: [], unavailable };
}
