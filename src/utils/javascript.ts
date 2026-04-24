import dayjs, { type Dayjs } from 'dayjs';

const concatDate = (dateStart: string, dateEnd: string, glue: string) => {
    let start = dayjs(dateStart).format('DD/MM');
    const startYear = dayjs(dateStart).format('YYYY');
    const end = dayjs(dateEnd).format('DD/MM/YYYY');
    const endYear = dayjs(dateEnd).format('YYYY');
    if (startYear !== endYear) {
        start = `${start}/${startYear}`;
    }
    return `${start} ${glue} ${end}`;
};

const csv = (data: any[], filename = 'export') => {
    if (!data?.length) {
        return;
    }
    const lines = [Object.keys(data[0]).join(';')];
    for (const line of data) {
        const fix = Object.values(line).map((value: any) => {
            if (!value) {
                return '';
            }
            return String(value).replaceAll(';', '_');
        });
        lines.push(Object.values(fix).join(';'));
    }
    const link = document.createElement('a');
    const file = new Blob([`\uFEFF${lines.join('\n')}`], {
        type: 'text/csv;charset=utf8',
    });
    link.href = URL.createObjectURL(file);
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
};

const favicon = (value?: string | undefined): void => {
    if (!value) {
        return;
    }
    const favicon = document.getElementById('favicon') as HTMLAnchorElement;
    favicon.remove();
    if (value) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = value;
        link.id = 'favicon';
        document.head.appendChild(link);
    }
};

const googleFonts = (values: string[]): void => {
    if (values) {
        const query = values.map((value) => value.replaceAll(' ', '+')).join('&family=');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${query}`;
        document.head.appendChild(link);
    }
};

const hexColor = (hex: string, percent: number): string => {
    const replaced = hex.replace(/^#/, '');
    const string =
        replaced.length === 3
            ? replaced
                  .split('')
                  .map((char) => char + char)
                  .join('')
            : replaced;
    let r = Number.parseInt(string.slice(0, 2), 16);
    let g = Number.parseInt(string.slice(2, 4), 16);
    let b = Number.parseInt(string.slice(4, 6), 16);
    r = Math.max(0, Math.min(255, r + Math.round(r * percent)));
    g = Math.max(0, Math.min(255, g + Math.round(g * percent)));
    b = Math.max(0, Math.min(255, b + Math.round(b * percent)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

const joinDate = (date: string | Dayjs, time: string) => {
    return dayjs(date)
        .hour(Number(time.split(':')[0]))
        .minute(Number(time.split(':')[1]))
        .second(0)
        .millisecond(0);
};

const parseJSON = (value?: string | null, initial?: any): any | undefined => {
    if (!value) {
        return initial;
    }
    try {
        return JSON.parse(value);
    } catch {
        return initial;
    }
};

const searchValueInObject = (jsonObj: any, target: string) => {
    let result = false;
    function search(jsonObj: any) {
        if (typeof jsonObj === 'object') {
            for (const key in jsonObj) {
                if (jsonObj[key] === target) {
                    result = true;
                    return;
                }
                if (typeof jsonObj[key] === 'object') {
                    search(jsonObj[key]);
                }
            }
        }
    }
    for (const each of jsonObj) {
        if (!result) {
            search(each);
        }
    }
    return result;
};

const sorter = (a: number | string, b: number | string): number => {
    if (!Number.isNaN(Number(a))) {
        return Number(a) - Number(b);
    }
    return String(a).localeCompare(String(b));
};

const trim = (value: string, character = ' ') => {
    return value.split(character).filter(Boolean).join(character);
};

const utc = (date: string, time: string): Dayjs => {
    const [hour, minute] = time.split(':');
    const object = dayjs(date)
        .set('hour', Number.parseInt(hour, 10))
        .set('minute', Number.parseInt(minute, 10));
    const hours = new Date().getTimezoneOffset() / 60;
    if (hours < 0) {
        object.subtract(hours * -1, 'hours');
    } else {
        object.add(hours, 'hours');
    }
    return object;
};

export {
    concatDate,
    csv,
    favicon,
    googleFonts,
    hexColor,
    joinDate,
    parseJSON,
    searchValueInObject,
    sorter,
    trim,
    utc,
};
