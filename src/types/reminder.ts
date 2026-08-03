export type ReminderType = 'water' | 'eye' | 'stand';

export interface ReminderConfig {
    enabled: boolean;
    interval: number; // in minutes
    message: string;
    title: string;
}

export interface ReminderStats {
    dailyCompleted: number;
    dailySkipped: number;
    dailySnoozed: number;
    lifetimeCompleted: number;
    lifetimeSkipped: number;
    lifetimeSnoozed: number;
    lastCompleted: number | null; // timestamp
}

export interface ReminderState {
    type: ReminderType;
    config: ReminderConfig;
    stats: ReminderStats;
    nextTriggerTime: number; // timestamp
    isPaused: boolean;
}
