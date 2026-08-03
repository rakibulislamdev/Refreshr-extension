import { ReminderType } from '../types/reminder';

export class StandReminder {
    public readonly type: ReminderType = 'stand';
    public readonly defaultTitle = 'Stand & Stretch 🚶';
    public readonly defaultMessage = 'Stand up, stretch, and move around for a bit.';
}
