import { NotificationItem } from "./types/notification";

export const notificationData: NotificationItem[] = [
    {
      id: '1',
      title: 'Orders Cancelled!',
      message: 'You have cancelled an order at Burger Hut. We apologize for your inconvenience. We will try to improve our service.',
      timestamp: '19 Dec, 2022 | 20:50 PM',
      type: 'error',
      isNew: true
    },
    {
      id: '2',
      title: 'Orders Successful!',
      message: 'You have placed an order at Burger Hut and paid $24. Your food will arrive soon. Enjoy our service! 😊',
      timestamp: '19 Dec, 2022 | 20:47 PM',
      type: 'success',
      isNew: true
    },
    {
      id: '3',
      title: 'New Services Available!',
      message: 'You can now make multiple food orders at one time. You can also cancel your orders.',
      timestamp: '12 Dec, 2022 | 10:52 AM',
      type: 'warning',
      isNew: false
    },
    {
      id: '4',
      title: 'Credit Card Connected!',
      message: 'Your credit card has been successfully linked with FoodU. Enjoy our services.',
      timestamp: '12 Dec, 2022 | 10:48 PM',
      type: 'info',
      isNew: false
    },
    {
      id: '5',
      title: 'Account Setup Successful!',
      message: 'Your account creation is successful, you can now experience our services.',
      timestamp: '12 Dec, 2022 | 14:27 PM',
      type: 'success',
      isNew: false
    }
  ];