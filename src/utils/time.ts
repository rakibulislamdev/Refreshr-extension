export function minutesToMs(minutes: number): number {
    return minutes * 60 * 1000;
}

export function msToMinutes(ms: number): number {
    return Math.max(0, Math.floor(ms / (60 * 1000)));
}

export function formatCountdown(msRemaining: number): string {
    if (msRemaining <= 0) {
        return '00:00';
    }
    const totalSeconds = Math.ceil(msRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
}

export function isSameDay(t1: number, t2: number): boolean {
    const d1 = new Date(t1);
    const d2 = new Date(t2);
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}
