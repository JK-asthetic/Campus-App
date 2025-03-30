import { Item } from "./items";

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  slug: string;
  item: string;
  details: string;
  status: OrderStatus;
  date: string;
  items: Item[];
};
