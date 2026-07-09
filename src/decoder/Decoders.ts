export const RAW_DECODER = (value: Uint8Array): Uint8Array => value;

export const STRING_DECODER = (value: Uint8Array): string =>
    new TextDecoder().decode(value);

export const UINT8_DECODER = (value: Uint8Array): number =>
    value[0];

export const UINT16_DECODER = (value: Uint8Array): number =>
    (value[0] << 8) | value[1];

export const UINT32_DECODER = (value: Uint8Array): number =>
    (value[0] * 0x1000000) +
    (value[1] << 16) +
    (value[2] << 8) +
    value[3];

export const UINT64_DECODER = (value: Uint8Array): bigint => {

    let result = 0n;

    for (const b of value) {
        result = (result << 8n) | BigInt(b);
    }

    return result;

};

export const PLATFORM_HEADING_DECODER = (value: Uint8Array): number => {

    const raw = UINT16_DECODER(value);

    return raw * 360 / 65535;

};

export const LATITUDE_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -90, 90);

export const LONGITUDE_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -180, 180);

export const PITCH_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -20, 20);

export const ROLL_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -50, 50);

export const ANGLE_360_DECODER = (value: Uint8Array): number =>
    mapUnsigned(value, 0, 360);

export const ANGLE_180_DECODER = (value: Uint8Array): number =>
    mapUnsigned(value, 0, 180);

export const ELEVATION_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -180, 180);

export const SLANT_RANGE_DECODER = (value: Uint8Array): number =>
    mapUnsigned(value, 0, 5000000);

export const TARGET_WIDTH_DECODER = (value: Uint8Array): number =>
    mapUnsigned(value, 0, 10000);

export const FRAME_CENTER_ELEV_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -900, 19000);

export const OFFSET_CORNER_DECODER = (value: Uint8Array): number =>
    mapSigned(value, -0.075, 0.075);


function mapSigned(value: Uint8Array, min: number, max: number): number {
    const raw = toSigned(value);
    const bits = value.length * 8;
    const maxRaw = Math.pow(2, bits - 1) - 1;
    const minRaw = -maxRaw;
    return min + ((max - min) * (raw - minRaw) / (maxRaw - minRaw));
}

function mapUnsigned(value: Uint8Array, min: number, max: number): number {
    const raw = toUnsigned(value);
    const maxRaw = Math.pow(2, value.length * 8) - 1;
    return min + ((max - min) * raw / maxRaw);
}

function toSigned(value: Uint8Array): number {
    const unsigned = toUnsigned(value);
    const bits = value.length * 8;
    const signThreshold = Math.pow(2, bits - 1);

    if (unsigned < signThreshold) {
        return unsigned;
    }

    return unsigned - Math.pow(2, bits);
}

function toUnsigned(value: Uint8Array): number {
    let result = 0;
    for (const byte of value) {
        result = (result * 256) + byte;
    }
    return result;
}

