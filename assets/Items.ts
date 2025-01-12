import { Item } from './types/items';

export const ITEMS: Item[] = [
  {
    id: 1,
    title: 'Macbook Pro (2024)',
    slug: 'macbook-pro-2024',
    heroImage: require('../assets/images/mac-book-1.jpg'),
    imagesUrl: [
      require('../assets/images/mac-book-1.jpg'),
      require('../assets/images/mac-book-2.jpg'),
      require('../assets/images/mac-book-3.jpg'),
    ],
    price: 899.99,
    category: {
      imageUrl: require('../assets/images/mac-book-1.jpg'),
      name: 'Laptops',
      slug: 'laptops',
    },
    Orderable: true,
  },
  {
    id: 5,
    title: 'Dell XPS 13',
    slug: 'dell-xps-13',
    heroImage: require('../assets/images/dell-1.jpg'),
    imagesUrl: [
      require('../assets/images/dell-1.jpg'),
      require('../assets/images/dell-2.jpg'),
    ],
    price: 1099.99,
    category: {
      imageUrl: require('../assets/images/mac-book-1.jpg'),
      name: 'Laptops',
      slug: 'laptops',
    },
    Orderable: true,
  },
  {
    id: 2,
    title: 'IPhone 15',
    slug: 'i-phone-15',
    heroImage: require('../assets/images/i-phone-1.jpg'),
    imagesUrl: [
      require('../assets/images/i-phone-2.jpg'),
      require('../assets/images/i-phone-3.jpg'),
    ],
    price: 999.99,
    category: {
      imageUrl: require('../assets/images/i-phone-1.jpg'),
      name: 'Phones',
      slug: 'phones',
    },
    Orderable: false,
  },
  {
    id: 6,
    title: 'Samsung Galaxy S21',
    slug: 'samsung-galaxy-s21',
    heroImage: require('../assets/images/samsung-1.jpg'),
    imagesUrl: [
      require('../assets/images/samsung-1.jpg'),
      require('../assets/images/samsung-2.jpg'),
    ],
    price: 799.99,
    category: {
      imageUrl: require('../assets/images/i-phone-1.jpg'),
      name: 'Phones',
      slug: 'phones',
    },
    Orderable: true,
  },
  {
    id: 7,
    title: 'Nintendo Switch',
    slug: 'nintendo-switch',
    heroImage: require('../assets/images/nintendo-switch-1.jpg'),
    imagesUrl: [
      require('../assets/images/nintendo-switch-1.jpg'),
      require('../assets/images/nintendo-switch-2.jpg'),
    ],
    price: 299.99,
    category: {
      imageUrl: require('../assets/images/ps-5-1.jpg'),
      name: 'Gaming',
      slug: 'gaming',
    },
    Orderable: true,
  },
];
