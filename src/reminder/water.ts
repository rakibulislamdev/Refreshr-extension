import { ReminderType } from '../types/reminder';

export class WaterReminder {
    public readonly type: ReminderType = 'water';
    public readonly defaultTitle = 'Drink Water 💧';
    public readonly defaultMessage = 'Time to drink some water and stay hydrated!';
}
