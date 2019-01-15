import { seedServiceList } from "redux-data-service";

/**
 * Seeds a given service with a specified number of paged data
 *
 * @param serviceName- the name of the service to seed
 * @param pageSize - the size of each page seeded into the service
 * @param totalPages - total amount of pages to seed the service with
 */
export function seedServiceListWithPagingOptions(serviceName: string, pageSize: number, totalPages: number) {
  const firstPageQueryOptions = {
    queryParams: { page: 1 },
    pageSize,
    totalCount: pageSize,
    hasNext: true,
    nextPage: 2,
    hasPrevious: false,
    currentPage: 1,
    totalPages,
  };

  const lastPageQueryOptions = {
    queryParams: { page: totalPages },
    pageSize,
    totalCount: pageSize,
    hasNext: false,
    hasPrevious: true,
    previousPage: totalPages - 1,
    currentPage: totalPages,
    totalPages,
  };

  seedServiceList<any>(serviceName, pageSize, { fullText: "page1" }, firstPageQueryOptions);
  seedServiceList<any>(serviceName, pageSize, { fullText: `page${totalPages}` }, lastPageQueryOptions);

  for (let i = 2; i < totalPages; i++) {
    seedServiceList<any>(
      serviceName,
      pageSize,
      { fullText: `page${i}` },
      {
        queryParams: { page: i },
        pageSize,
        totalCount: pageSize,
        hasNext: true,
        nextPage: i + 1,
        hasPrevious: true,
        previousPage: i - 1,
        currentPage: i,
        totalPages,
      },
    );
  }
}
