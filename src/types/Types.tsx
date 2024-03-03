export type Photo = {
  id: string;
  alt_description: string;
  urls: {
    regular: string;
  };
  downloads: number;
  likes: number;
  views: number;
};

export type Cache = {
  [key: string]: {
    data: Photo[];
    page: number;
  };
};
