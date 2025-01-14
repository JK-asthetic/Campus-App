import { Item } from './items';

export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

export type Order = {
  id: string;
  slug: string;
  item: string;
  details: string;
  status: OrderStatus;
  date: string;
  items: Item[];
};
