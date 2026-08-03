import * as vscode from 'vscode';
import { ReminderStats, ReminderType } from '../types/reminder';
import { isSameDay } from '../utils/time';

const STATS_KEY_PREFIX = 'refreshr.stats.';

export class StorageService {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public getStats(type: ReminderType): ReminderStats {
        const key = `${STATS_KEY_PREFIX}${type}`;
        const defaultStats: ReminderStats = {
            dailyCompleted: 0,
            dailySkipped: 0,
            dailySnoozed: 0,
            lifetimeCompleted: 0,
            lifetimeSkipped: 0,
            lifetimeSnoozed: 0,
            lastCompleted: null
        };

        const stored = this.context.globalState.get<ReminderStats>(key);
        if (!stored) {
            return defaultStats;
        }

        // Auto-reset daily counts if it's a new day (relative to lastCompleted or last interaction)
        const now = Date.now();
        const lastDate = stored.lastCompleted;
        
        if (lastDate && !isSameDay(lastDate, now)) {
            return {
                ...stored,
                dailyCompleted: 0,
                dailySkipped: 0,
                dailySnoozed: 0
            };
        }

        return stored;
    }

    public saveStats(type: ReminderType, stats: ReminderStats): void {
        const key = `${STATS_KEY_PREFIX}${type}`;
        this.context.globalState.update(key, stats);
    }

    public clearAllStats(): void {
        const types: ReminderType[] = ['water', 'eye', 'stand'];
        for (const type of types) {
            const key = `${STATS_KEY_PREFIX}${type}`;
            this.context.globalState.update(key, undefined);
        }
    }
}
