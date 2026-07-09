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

    readByte(): number {
        if (!this.hasRemaining()) {
            throw new Error("Unexpected end of buffer.");
        }

        return this.data[this.offset++];
    }

    readBytes(length: number): Uint8Array {
        if (!this.hasRemaining(length)) {
            throw new Error("Unexpected end of buffer.");
        }

        const bytes = this.data.slice(this.offset, this.offset + length);
        this.offset += length;

        return bytes;
    }

    skip(length: number): void {
        if (!this.hasRemaining(length)) {
            throw new Error("Unexpected end of buffer.");
        }

        this.offset += length;
    }
}