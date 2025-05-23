const cron = require('node-cron');
const Notification = require('../models/Notification');
const FlaggedReviewNotification = require('../models/FlaggedReviewNotification');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

    // Delete read notifications older than 15 days
    await Notification.deleteMany({
      createdAt: { $lt: fifteenDaysAgo },
      read: true
    });

    await FlaggedReviewNotification.deleteMany({
      createdAt: { $lt: fifteenDaysAgo },
      read: true
    });

    console.log('Deleted old notifications');
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
});

console.log('Notification cleanup cron job scheduled');