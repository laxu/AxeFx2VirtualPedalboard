import { PARAM_VALUE_MULTIPLIER, MIDI_VALUE_MULTIPLIER } from "../api/constants";

export const textDecoder = new TextDecoder('utf-8');

export function getObjKeyByValue(val: any, obj: any): string {
    for (let key in obj) {
        if(obj[key] === val) {
            return key;
        }
    }
    return null;
}

export function intTo2Byte(val: number): Uint8Array {
    const byte1 = val & 0x7F;
    const byte2 = val >> 7;
    return Uint8Array.from([byte1, byte2]);
}

export function bytes2ToInt(bytes: Uint8Array): number {
    return (bytes[0] & 0x7F) << 7 | bytes[1];
}

export function parameterValueBytesToInt(byteArray): number {
    return (byteArray[0] & 0x7F) | ((byteArray[1] & 0x7F)<<7) | ((byteArray[2] & 0x7F)<<14);
}

export function parameterValueIntToBytes(value: number): Uint8Array {
    const byte1 = value & 0x7F;
    const byte2 = (value >> 7) & 0x7F;
    const byte3 = (value >> 14) & 0x7F;
    return Uint8Array.from([byte1, byte2, byte3]);
}

export function clampValue(val: number, range: [number, number], step: number): number {
    let value = Math.min(Math.max(range[0], val), range[1]);
    if (step && value % step > 0) {
        value = value - value % step;
    }
    return value;
}

export function midiValueToAxeFx(value: number): number {
    return (value / MIDI_VALUE_MULTIPLIER) * PARAM_VALUE_MULTIPLIER;
}

export function axeFxValueToMIDI(value: number): number {
    return (value / PARAM_VALUE_MULTIPLIER) * MIDI_VALUE_MULTIPLIER;
}

export function axeFxValueToInt(value: number): number {
    return value / PARAM_VALUE_MULTIPLIER;
}

export function intValueToAxeFx(value: number): number {
    return value * PARAM_VALUE_MULTIPLIER;
}

export function isElectron(): boolean {
    return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
}

export function numRange (start: number, end: number) {
    return Array.from(Array(end - start + 1), (_, i) => start + i);
}

export function generateId() {
    return window.crypto.getRandomValues(new Uint8Array(3)).join('');
}

export function handleSubmit(callback) {
    return (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formObj = {};
        for (const [key, value] of formData.entries()) {
            formObj[key] = value;
        }
        callback(formObj);
        return false;
    }
}
