export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  arbitraryPositioning: number;
}

export interface Bookmark {
  id: string;
  directoryId: string;
  url: string;
  title: string;
  arbitraryPositioning: number;
}

export interface BookmarkDir {
  id: string;
  name: string;
  bookmarks: Bookmark[];
  arbitraryPositioning: number;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  url: string;
  isMain: boolean;
}
