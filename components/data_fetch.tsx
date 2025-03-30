import { DataService } from '../services/DataService';

// In your component:
const fetchData = async () => {
  try {
    const items = await DataService.getItems();
    const categories = await DataService.getCategories();
    // Use the data in your component
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};