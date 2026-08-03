import * as vscode from 'vscode';
import { ReminderManager } from '../reminder/manager';

export function registerStartCommand(context: vscode.ExtensionContext, manager: ReminderManager): vscode.Disposable {
    return vscode.commands.registerCommand('refreshr.start', () => {
        manager.start();
        vscode.window.showInformationMessage('Refreshr: Reminders started! Take care of yourself. 💚');
    });
}
