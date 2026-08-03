import * as vscode from 'vscode';
import { ReminderState, ReminderStats, ReminderType } from '../types/reminder';
import { SettingsService } from '../services/settings';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notification';
import { TimerService } from '../services/timer';
import { minutesToMs } from '../utils/time';

export class ReminderManager {
    private storageService: StorageService;
    private timerService: TimerService;
    private reminderStates: Map<ReminderType, ReminderState> = new Map();
    private activeReminderTypes: ReminderType[] = ['water', 'eye', 'stand'];
    private isPaused = false;
    private statusUpdateEmitter = new vscode.EventEmitter<void>();

    public readonly onStatusUpdate = this.statusUpdateEmitter.event;

    constructor(storageService: StorageService, timerService: TimerService) {
        this.storageService = storageService;
        this.timerService = timerService;

        this.initStates();
        this.timerService.addListener(() => this.onTick());

        // Listen for configuration updates
        SettingsService.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('refreshr')) {
                this.reloadConfiguration();
            }
        });
    }

    private initStates(): void {
        const now = Date.now();
        for (const type of this.activeReminderTypes) {
            const config = SettingsService.getReminderConfig(type);
            const stats = this.storageService.getStats(type);
            const nextTriggerTime = now + minutesToMs(config.interval);

            this.reminderStates.set(type, {
                type,
                config,
                stats,
                nextTriggerTime,
                isPaused: !config.enabled
            });
        }
    }

    public reloadConfiguration(): void {
        const now = Date.now();
        for (const type of this.activeReminderTypes) {
            const current = this.reminderStates.get(type);
            if (current) {
                const config = SettingsService.getReminderConfig(type);
                // If interval changed or enabled state changed
                const intervalChanged = current.config.interval !== config.interval;
                const enabledChanged = current.config.enabled !== config.enabled;

                current.config = config;
                current.isPaused = !config.enabled || this.isPaused;

                if (intervalChanged || enabledChanged) {
                    current.nextTriggerTime = now + minutesToMs(config.interval);
                }
            }
        }
        this.statusUpdateEmitter.fire();
    }

    public start(): void {
        this.isPaused = false;
        const now = Date.now();
        for (const [_, state] of this.reminderStates) {
            if (state.config.enabled) {
                state.isPaused = false;
                state.nextTriggerTime = now + minutesToMs(state.config.interval);
            }
        }
        this.timerService.start();
        this.statusUpdateEmitter.fire();
    }

    public stop(): void {
        this.isPaused = true;
        for (const [_, state] of this.reminderStates) {
            state.isPaused = true;
        }
        this.timerService.stop();
        this.statusUpdateEmitter.fire();
    }

    public reset(): void {
        const now = Date.now();
        this.storageService.clearAllStats();
        for (const [type, state] of this.reminderStates) {
            const config = SettingsService.getReminderConfig(type);
            state.config = config;
            state.stats = {
                dailyCompleted: 0,
                dailySkipped: 0,
                dailySnoozed: 0,
                lifetimeCompleted: 0,
                lifetimeSkipped: 0,
                lifetimeSnoozed: 0,
                lastCompleted: null
            };
            state.nextTriggerTime = now + minutesToMs(config.interval);
            state.isPaused = !config.enabled || this.isPaused;
        }
        this.statusUpdateEmitter.fire();
    }

    public getClosestReminder(): { type: ReminderType; state: ReminderState; remainingMs: number } | null {
        if (this.isPaused) {
            return null;
        }

        let closest: { type: ReminderType; state: ReminderState; remainingMs: number } | null = null;
        const now = Date.now();

        for (const [type, state] of this.reminderStates) {
            if (state.config.enabled && !state.isPaused) {
                const remaining = state.nextTriggerTime - now;
                if (!closest || remaining < closest.remainingMs) {
                    closest = { type, state, remainingMs: remaining };
                }
            }
        }

        return closest;
    }

    public getAllStates(): ReminderState[] {
        return Array.from(this.reminderStates.values());
    }

    private onTick(): void {
        if (this.isPaused) {
            return;
        }

        const now = Date.now();
        let updated = false;

        for (const [type, state] of this.reminderStates) {
            if (state.config.enabled && !state.isPaused && now >= state.nextTriggerTime) {
                // Trigger reminder!
                this.triggerReminder(type, state);
                // Temporarily pause this reminder until user interacts or next schedule
                state.nextTriggerTime = now + minutesToMs(state.config.interval);
                updated = true;
            }
        }

        if (updated || true) { // Fire status bar update every second for the countdown tick
            this.statusUpdateEmitter.fire();
        }
    }

    private triggerReminder(type: ReminderType, state: ReminderState): void {
        NotificationService.showReminder(
            state.config.title,
            state.config.message,
            (action) => this.handleReminderAction(type, action)
        );
    }

    private handleReminderAction(type: ReminderType, action: 'completed' | 'skipped' | 'snoozed'): void {
        const state = this.reminderStates.get(type);
        if (!state) {
            return;
        }

        const now = Date.now();

        if (action === 'completed') {
            state.stats.dailyCompleted++;
            state.stats.lifetimeCompleted++;
            state.stats.lastCompleted = now;
            state.nextTriggerTime = now + minutesToMs(state.config.interval);
            vscode.window.showInformationMessage(`Great job! Keep up the healthy habits. 💪`);
        } else if (action === 'skipped') {
            state.stats.dailySkipped++;
            state.stats.lifetimeSkipped++;
            state.nextTriggerTime = now + minutesToMs(state.config.interval);
        } else if (action === 'snoozed') {
            state.stats.dailySnoozed++;
            state.stats.lifetimeSnoozed++;
            // Snooze for 5 minutes
            state.nextTriggerTime = now + minutesToMs(5);
            vscode.window.showInformationMessage(`Reminder snoozed for 5 minutes. ⏰`);
        }

        this.storageService.saveStats(type, state.stats);
        this.statusUpdateEmitter.fire();
    }
}
