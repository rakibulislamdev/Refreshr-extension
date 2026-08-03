import * as vscode from 'vscode';
import { ReminderManager } from '../reminder/manager';

export function registerStopCommand(context: vscode.ExtensionContext, manager: ReminderManager): vscode.Disposable {
    return vscode.commands.registerCommand('refreshr.stop', () => {
        manager.stop();
        vscode.window.showInformationMessage('Refreshr: Reminders paused. Don\'t forget to rest! 💤');
    });
}
