export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'default';
    isNew?: boolean;
  }