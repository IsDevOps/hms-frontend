import { isToday, isYesterday, parseISO } from 'date-fns';
import { Notification } from '@/store/services/in-app/typings';

type GroupedNotifications = {
  Today: Notification[];
  Yesterday: Notification[];
  Earlier: Notification[];
};

export function groupNotificationsByDate(notifications: Notification[]): {
  groups: GroupedNotifications;
  hasUnreadToday: boolean;
} {
  const groups: GroupedNotifications = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };
  let hasUnreadToday = false;

  notifications.forEach((notification) => {
    if (!notification?.scheduledAt) return;
    const date = parseISO(notification.scheduledAt);

    if (isToday(date)) {
      groups.Today.push(notification);
      if (!notification.isRead) {
        hasUnreadToday = true;
      }
    } else if (isYesterday(date)) {
      groups.Yesterday.push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  return { groups, hasUnreadToday };
}
