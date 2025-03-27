import { Item } from './items';

export type Category = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  items?: Item[];
};
