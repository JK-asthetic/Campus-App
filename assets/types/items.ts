import { ImageSourcePropType } from 'react-native';
import { Category } from './category';

export type Item = {
  id: number;
  title: string;
  imagesUrl: ImageSourcePropType[];
  price: number;
  heroImage: any;
  category_id: number;
  orderable: boolean;
  description: string;
  nutritionalInfo?:string;
  quantity?: number;
};


