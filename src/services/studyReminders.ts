import { Platform } from 'react-native';

// Remove reminders scheduled by earlier versions of the app on this device.
export async function cancelPreviousStudyReminder() {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  await Notifications.cancelScheduledNotificationAsync('mnemoflip-daily-study-reminder');
}
