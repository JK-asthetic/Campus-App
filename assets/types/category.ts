import { Item } from './items';

export type Category = {
  name: string;
  imageUrl: string;
  slug: string;
  items: Item[];
};
