const STORAGE_KEY = 'jpm_lms_notifications';

/**
 * Simple in-app notification service.
 * Stores notifications in localStorage per userId.
 */
class NotificationService {
  _getAll() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [];
  }

  _saveAll(notifs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  }

  addNotification(userId, message, type = 'info') {
    const all = this._getAll();
    all.unshift({
      id: `notif-${Date.now()}`,
      userId,
      message,
      type, // 'success', 'warning', 'info', 'error'
      read: false,
      createdAt: new Date().toISOString()
    });
    // Keep max 50 per user
    const filtered = all.filter(n => n.userId === userId).slice(0, 50);
    const others = all.filter(n => n.userId !== userId);
    this._saveAll([...filtered, ...others]);
  }

  getNotifications(userId) {
    return this._getAll().filter(n => n.userId === userId);
  }

  getUnreadCount(userId) {
    return this._getAll().filter(n => n.userId === userId && !n.read).length;
  }

  markAllRead(userId) {
    const all = this._getAll();
    all.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this._saveAll(all);
  }

  markRead(notifId) {
    const all = this._getAll();
    const n = all.find(x => x.id === notifId);
    if (n) n.read = true;
    this._saveAll(all);
  }
}

export const notificationService = new NotificationService();
