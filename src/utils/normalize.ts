import dayjs from 'dayjs';
import parsePhoneNumberFromString from 'libphonenumber-js';

class Normalize {
    mask = (value: string | number, mask: string): string => {
        if (!value) {
            return '';
        }
        const numeric = String(value).replace(/\D/g, '');
        let digit = 0;
        let output = '';
        if (!numeric.length) {
            return '';
        }
        for (let i = 0; i < mask.length; i += 1) {
            if (mask.charAt(i) === '_') {
                output += numeric.charAt(digit);
                if (!numeric.charAt(digit + 1)) {
                    break;
                }
                digit += 1;
            } else {
                output += mask.charAt(i);
            }
        }
        return output;
    };

    alpha = (value: string): string => {
        return value.replace(/[0-9]/g, '');
    };

    capitalize = (value: string): string => {
        if (!value) {
            return '';
        }
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
    };

    credit = (value: string): string => this.mask(value, '____ ____ ____ ____');

    currency = (value: string | number): string => {
        if (!value && value !== '0' && value !== '0,00' && value !== 0) {
            return '';
        }
        let integer = '';
        let decimal = '';
        if (typeof value === 'number') {
            const number = Number(value);
            const split = String(number.toFixed(2)).split('.');
            integer = String(Number(split[0]));
            decimal = split[1] ? String(split[1].slice(0, 2)) : '0';
        } else {
            const numeric = String(value).replace(/\D/g, '');
            decimal = numeric.slice(-2);
            integer = numeric.slice(0, -2);
        }
        if (decimal.length === 1) {
            decimal = `0${decimal}`;
        }
        if (integer.slice(0, 1) === '0') {
            integer = integer.slice(1);
        }
        if (integer.length) {
            integer = String(integer).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        } else {
            integer = '0';
        }
        if (integer.replaceAll('0', '') === '') {
            integer = '0';
        }
        return `${integer},${decimal}`;
    };

    currencyToFloat = (value: string): number => {
        return Number.parseFloat(value.replaceAll('.', '').replace(',', '.'));
    };

    date = (value: string): string => this.mask(value, '__/__/____');

    day = (value: string): string => this.mask(value, '__/__');

    dateIgnoringTime = (value: string, format = 'DD/MM/YYYY'): string => {
        if (!value) {
            return '';
        }
        return dayjs(value.split('T')[0]).format(format);
    };

    dateCard = (value: string): string => this.mask(value, '__/____');

    document = (value: string, country = 'BR'): string => {
        if (country === 'BR') {
            return this.mask(value, '___.___.___-__');
        }
        return value;
    };

    fullname = (value: string): string => {
        const fix = this.titlecase(value);
        return fix.replace(/[0-9]/g, '');
    };

    lowercase = (value: string): string => {
        return value.toLowerCase();
    };

    minute = (value: number): string => {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    number = (value: string): string => {
        const fix = value ? Number.parseInt(value, 10).toLocaleString('pt-BR') : '0';
        return fix === 'NaN' ? '0' : fix;
    };

    numeric = (value: string): string => {
        return value ? value.replace(/\D/g, '') : '';
    };

    phone = (value: string): string => {
        if (!value.startsWith('+')) {
            value = `+${value}`;
        }
        const parse = parsePhoneNumberFromString(value);
        return parse?.formatNational() || value;
    };

    store = (value: string, country = 'BR'): string => {
        if (country !== 'BR') {
            return value;
        }
        const clean = value.toUpperCase().replace(/[.\-/]/g, '');
        if (!clean.length) {
            return '';
        }
        const mask = '__.___.___/____-__';
        let digit = 0;
        let output = '';
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === '_') {
                if (digit >= clean.length) {
                    break;
                }
                output += clean[digit];
                digit++;
            } else {
                output += mask[i];
            }
        }
        return output;
    };

    tag = (value: string): string => {
        if (!value) {
            return '';
        }
        const fix = value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        const number = fix.replaceAll(/[.\-/]/g, '');
        if (!Number.isNaN(Number(number))) {
            return number;
        }
        return fix.toLowerCase();
    };

    time = (value: string): string => this.mask(value, '__:__');

    titlecase = (value: string): string => {
        if (!value) {
            return '';
        }
        const exclude = 'as,à,às,com,da,de,do,e,etc,na,no,o,dos'.split(',');
        const array = value.split(' ');
        return array
            ?.map((word) => {
                const w = word.toLowerCase();
                if (!exclude.includes(w)) {
                    return w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '';
                }
                return w;
            })
            .join(' ')
            .replaceAll('S/a', 'S/A');
    };

    uppercase = (value: string): string => {
        return value.toUpperCase();
    };

    zipcode = (value: string): string => this.mask(value, '_____-___');
}

const normalize = new Normalize();

export default normalize;
