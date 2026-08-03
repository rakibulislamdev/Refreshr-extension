import * as vscode from 'vscode';
import { ReminderManager } from '../reminder/manager';
import { formatCountdown } from '../utils/time';
import { ReminderType } from '../types/reminder';

const TYPE_ICONS: Record<ReminderType, string> = {
    water: '💧',
    eye: '👀',
    stand: '🚶'
};

export class RefreshrStatusBar {
    private item: vscode.StatusBarItem;
    private manager: ReminderManager;

    constructor(manager: ReminderManager) {
        this.manager = manager;

        this.item = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.item.command = 'refreshr.showMenu';
        this.item.tooltip = 'Refreshr wellness companion. Click to open options.';
        this.item.show();

        this.manager.onStatusUpdate(() => this.update());
        this.update();
    }

    public update(): void {
        const closest = this.manager.getClosestReminder();

        if (!closest) {
            this.item.text = '$(pulse) Refreshr: Paused';
            this.item.tooltip = 'Refreshr wellness companion is currently paused.';
            return;
        }

        const icon = TYPE_ICONS[closest.type];
        const typeName = closest.type.charAt(0).toUpperCase() + closest.type.slice(1);
        const timeStr = formatCountdown(closest.remainingMs);

        this.item.text = `${icon} Next Break: ${timeStr}`;
        this.item.tooltip = `Next reminder: ${typeName} in ${timeStr}. Click to open menu.`;
    }

    public async showMenu(): Promise<void> {
        const activeStates = this.manager.getAllStates();
        const options: vscode.QuickPickItem[] = [];

        // Show status of each reminder
        options.push({
            label: '--- Statuses ---',
            kind: vscode.QuickPickItemKind.Separator
        });

        for (const state of activeStates) {
            const status = state.isPaused 
                ? 'Disabled' 
                : `Next in ${formatCountdown(state.nextTriggerTime - Date.now())}`;
            options.push({
                label: `${state.config.title}`,
                description: status,
                detail: `Interval: ${state.config.interval} mins`
            });
        }

        options.push({
            label: '--- Actions ---',
            kind: vscode.QuickPickItemKind.Separator
        });

        const isRunning = activeStates.some(s => !s.isPaused);

        if (isRunning) {
            options.push({
                label: '$(alert) Pause Reminders',
                description: 'Temporarily pause all active reminders'
            });
        } else {
            options.push({
                label: '$(play) Resume Reminders',
                description: 'Resume tracking health reminders'
            });
        }

        options.push({
            label: '$(graph) View Wellness Stats',
            description: 'Show water, eye break, and stand statistics'
        });

        options.push({
            label: '$(refresh) Reset All Stats & Timers',
            description: 'Clear stored numbers and restart intervals'
        });

        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select a Refreshr command'
        });

        if (!selection) {
            return;
        }

        if (selection.label.includes('Pause')) {
            vscode.commands.executeCommand('refreshr.stop');
        } else if (selection.label.includes('Resume')) {
            vscode.commands.executeCommand('refreshr.start');
        } else if (selection.label.includes('Stats')) {
            vscode.commands.executeCommand('refreshr.stats');
        } else if (selection.label.includes('Reset')) {
            vscode.commands.executeCommand('refreshr.reset');
        }
    }

    public dispose(): void {
        this.item.dispose();
    }
}
