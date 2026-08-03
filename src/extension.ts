import * as vscode from 'vscode';
import { StorageService } from './services/storage';
import { TimerService } from './services/timer';
import { ReminderManager } from './reminder/manager';
import { RefreshrStatusBar } from './statusbar/statusBar';
import { registerStartCommand } from './commands/start';
import { registerStopCommand } from './commands/stop';
import { registerStatsCommand } from './commands/stats';
import { registerResetCommand } from './commands/reset';

let timerService: TimerService | undefined;
let reminderManager: ReminderManager | undefined;
let statusBar: RefreshrStatusBar | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Refreshr extension is now active!');

    // Initialize Services
    const storageService = new StorageService(context);
    timerService = new TimerService();

    // Initialize Manager
    reminderManager = new ReminderManager(storageService, timerService);

    // Initialize Status Bar
    statusBar = new RefreshrStatusBar(reminderManager);

    // Register Commands
    const startDisposable = registerStartCommand(context, reminderManager);
    const stopDisposable = registerStopCommand(context, reminderManager);
    const statsDisposable = registerStatsCommand(context, reminderManager);
    const resetDisposable = registerResetCommand(context, reminderManager);

    // Register Status Bar Menu Command
    const menuDisposable = vscode.commands.registerCommand('refreshr.showMenu', () => {
        statusBar?.showMenu();
    });

    context.subscriptions.push(
        startDisposable,
        stopDisposable,
        statsDisposable,
        resetDisposable,
        menuDisposable,
        timerService
    );

    // Auto-start reminders if enabled
    reminderManager.start();
}

export function deactivate() {
    if (timerService) {
        timerService.stop();
        timerService.dispose();
    }
}
