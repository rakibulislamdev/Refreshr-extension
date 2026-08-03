import * as vscode from 'vscode';
import { ReminderManager } from '../reminder/manager';

export function registerResetCommand(context: vscode.ExtensionContext, manager: ReminderManager): vscode.Disposable {
    return vscode.commands.registerCommand('refreshr.reset', async () => {
        const confirm = 'Yes, reset everything';
        const choice = await vscode.window.showWarningMessage(
            'Are you sure you want to reset all Refreshr stats and reminder timers?',
            { modal: true },
            confirm
        );

        if (choice === confirm) {
            manager.reset();
            vscode.window.showInformationMessage('Refreshr: All stats and timers have been reset.');
        }
    });
}
