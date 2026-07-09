export type DecoderFunction = (value: Uint8Array) => unknown;


export interface Misb0601Definition {

    id: number;

    name: string;

    displayName: string;

    units?: string;

    min?: number;

    max?: number;

    decoder: DecoderFunction;

}
