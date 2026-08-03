import * as vscode from 'vscode';
import { ReminderManager } from '../reminder/manager';

export function registerStatsCommand(context: vscode.ExtensionContext, manager: ReminderManager): vscode.Disposable {
    return vscode.commands.registerCommand('refreshr.stats', () => {
        const states = manager.getAllStates();
        
        let message = '📊 Refreshr Wellness Stats:\n\n';
        
        for (const state of states) {
            const title = state.config.title;
            const stats = state.stats;
            message += `${title}:\n`;
            message += `  • Today: Completed: ${stats.dailyCompleted} | Snoozed: ${stats.dailySnoozed} | Skipped: ${stats.dailySkipped}\n`;
            message += `  • Lifetime: Completed: ${stats.lifetimeCompleted} | Snoozed: ${stats.lifetimeSnoozed} | Skipped: ${stats.lifetimeSkipped}\n\n`;
        }

        vscode.window.showInformationMessage(message, { modal: true });
    });
}
