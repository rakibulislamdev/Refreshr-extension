import { ReminderType } from '../types/reminder';

export class EyeReminder {
    public readonly type: ReminderType = 'eye';
    public readonly defaultTitle = 'Eye Break 👀';
    public readonly defaultMessage = 'Look at something 20 feet away for 20 seconds to rest your eyes.';
}
