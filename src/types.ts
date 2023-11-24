export interface Image {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  selected?: boolean
}
export interface SelectedImage {
  url: string,
  id: string
}
