import * as vscode from 'vscode';

export class NotificationService {
    public static async showReminder(
        title: string,
        message: string,
        onAction: (action: 'completed' | 'skipped' | 'snoozed') => void
    ): Promise<void> {
        const doneAction = 'Done ✅';
        const snoozeAction = 'Snooze (5m) ⏰';
        const skipAction = 'Skip 🛑';

        const choice = await vscode.window.showInformationMessage(
            `[Refreshr] ${title}: ${message}`,
            doneAction,
            snoozeAction,
            skipAction
        );

        if (choice === doneAction) {
            onAction('completed');
        } else if (choice === snoozeAction) {
            onAction('snoozed');
        } else if (choice === skipAction) {
            onAction('skipped');
        } else {
            // If the user closes the notification, count as skipped or ignored (let's do skipped)
            onAction('skipped');
        }
    }
}
