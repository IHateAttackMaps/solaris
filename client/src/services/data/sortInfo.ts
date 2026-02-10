export class SortInfo {
  propertyPaths: string[];
  sortAscending: boolean;

  constructor(propertyPaths: string[], sortAscending: boolean) {
    this.propertyPaths = propertyPaths ?? null;
    this.sortAscending = sortAscending ?? true;
  }

  swapSort(propertyPaths: string[] | string) {
    // If sorting by a new column, reset the sort.
    if (JSON.stringify(this.propertyPaths) !== JSON.stringify(propertyPaths)) {
      if (Array.isArray(propertyPaths[0])) {
        this.propertyPaths = propertyPaths as string[];
      } else {
        this.propertyPaths = [propertyPaths as string];
      }
      this.sortAscending = true
    } else {
      // Otherwise if we are sorting by the same column, flip the sort direction.
      this.sortAscending = !this.sortAscending
    }
  }

  static fromJSON(jsonSortInfo: string, defaultSortInfo: SortInfo) {
    let parsedSortInfo: SortInfo | null = null;

    try {
      parsedSortInfo = jsonSortInfo != undefined ? JSON.parse(jsonSortInfo) : null;
    }
    catch (e) {
      console.warn(`SortInfo.fromJSON failed to parse the following JSON: ${jsonSortInfo}`);
      console.warn(e);
    }

    // Fall back to defaults if we have them!
    if (parsedSortInfo?.propertyPaths != null && parsedSortInfo?.sortAscending != null) {
      return new SortInfo(parsedSortInfo?.propertyPaths, parsedSortInfo?.sortAscending);
    }
    else {
      return new SortInfo(defaultSortInfo?.propertyPaths, defaultSortInfo?.sortAscending);
    }
  }
}
