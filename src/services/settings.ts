import * as vscode from 'vscode';
import { ReminderConfig, ReminderType } from '../types/reminder';

const DEFAULT_CONFIGS: Record<ReminderType, ReminderConfig> = {
    water: {
        enabled: true,
        interval: 60,
        message: 'Time to drink some water and stay hydrated!',
        title: 'Drink Water 💧'
    },
    eye: {
        enabled: true,
        interval: 20,
        message: 'Look at something 20 feet away for 20 seconds to rest your eyes.',
        title: 'Eye Break 👀'
    },
    stand: {
        enabled: true,
        interval: 45,
        message: 'Stand up, stretch, and move around for a bit.',
        title: 'Stand & Stretch 🚶'
    }
};

export class SettingsService {
    public static getReminderConfig(type: ReminderType): ReminderConfig {
        const config = vscode.workspace.getConfiguration('refreshr');
        const typeConfig = config.get<Partial<ReminderConfig>>(type);

        const defaults = DEFAULT_CONFIGS[type];
        return {
            enabled: typeConfig?.enabled ?? defaults.enabled,
            interval: typeConfig?.interval ?? defaults.interval,
            message: typeConfig?.message ?? defaults.message,
            title: defaults.title
        };
    }

    public static onDidChangeConfiguration(listener: (e: vscode.ConfigurationChangeEvent) => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(listener);
    }
}
