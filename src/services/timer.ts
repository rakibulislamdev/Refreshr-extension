import * as vscode from 'vscode';

export class TimerService {
    private timerId: NodeJS.Timeout | null = null;
    private listeners: (() => void)[] = [];

    public start(): void {
        if (this.timerId) {
            return;
        }
        this.timerId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    public stop(): void {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    public addListener(listener: () => void): vscode.Disposable {
        this.listeners.push(listener);
        return {
            dispose: () => {
                this.listeners = this.listeners.filter(l => l !== listener);
            }
        };
    }

    private tick(): void {
        for (const listener of this.listeners) {
            try {
                listener();
            } catch (err) {
                console.error('Error in timer tick listener:', err);
            }
        }
    }

    public dispose(): void {
        this.stop();
        this.listeners = [];
    }
}
