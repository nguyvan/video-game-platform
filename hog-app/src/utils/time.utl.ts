export const formatTime = (time: number): string => {
    const hours: number = Math.floor(time / 3600);
    const hours_: string =
        hours >= 10 ? hours.toString() : "0" + hours.toString();
    const minuteSecond: number = time % 3600;
    const minutes: number = Math.floor(minuteSecond / 60);
    const minutes_: string =
        minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
    const second: number = Math.floor(minuteSecond % 60);
    const second_: string =
        second >= 10 ? second.toString() : "0" + second.toString();
    return `${hours_}:${minutes_}:${second_}`;
};

export const distanceTime = (time?: string): string => {
    if (time) {
        const now = Date.now();
        const then = Date.parse(time);

        const diff = (now - then) / 1000;

        let displayTime: number;
        let displayText: string;
        if (diff < 60) {
            displayTime = Math.floor(diff);
            displayText = displayTime <= 1 ? "second" : "seconds";
            return `${displayTime} ${displayText} ago
		`;
        } else if (diff < 60 * 60) {
            displayTime = Math.floor(diff / 60);
            displayText = displayTime <= 1 ? "minute" : "minutes";
            return `${displayTime} ${displayText} ago`;
        } else if (diff < 60 * 60 * 24) {
            displayTime = Math.floor(diff / 3600);
            displayText = displayTime <= 1 ? "hour" : "hours";
            return `${displayTime} ${displayText} ago`;
        } else {
            return new Date(time).toLocaleString();
        }
    }
    return "";
};
