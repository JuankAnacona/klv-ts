import { KlvParseError } from "../errors/KlvParseError";

export class ByteReader {

    private readonly data: Uint8Array;
    private offset = 0;

    constructor(data: Uint8Array) {
        this.data = data;
    }

    get position(): number {
        return this.offset;
    }

    get remaining(): number {
        return this.data.length - this.offset;
    }

    hasRemaining(length = 1): boolean {
        return this.remaining >= length;
    }

    private validateLength(length: number): void {
        if (!Number.isInteger(length) || length < 0) {
            throw new KlvParseError(`Invalid length ${length}.`, this.offset);
        }
    }

    readByte(): number {
        if (!this.hasRemaining()) {
            throw new KlvParseError("Unexpected end of buffer.", this.offset);
        }

        return this.data[this.offset++];
    }

    readBytes(length: number): Uint8Array {
        this.validateLength(length);

        if (!this.hasRemaining(length)) {
            throw new KlvParseError("Unexpected end of buffer.", this.offset);
        }

        const bytes = this.data.slice(this.offset, this.offset + length);
        this.offset += length;

        return bytes;
    }

    skip(length: number): void {
        this.validateLength(length);

        if (!this.hasRemaining(length)) {
            throw new KlvParseError("Unexpected end of buffer.", this.offset);
        }

        this.offset += length;
    }
}
