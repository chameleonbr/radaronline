const READ_NOTIFICATIONS_KEY = 'radar_read_notifications';

export function getReadNotifications(): Set<string> {
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveReadNotifications(ids: Set<string>) {
  localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...ids]));
}

export function getReadKey(requestId: string, status: string) {
  return `${requestId}-${status}`;
}
