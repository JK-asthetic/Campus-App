import { ImageSourcePropType } from 'react-native';
import { Category } from './category';

export type Item = {
  id: number;
  title: string;
  slug: string;
  imagesUrl: ImageSourcePropType[];
  price: number;
  heroImage: ImageSourcePropType;
  category: Omit<Category, 'items'>;
  Orderable: boolean;
  description: string;
};
