export class UniversalKey {

    static readonly LENGTH = 16;

    constructor(
        public readonly bytes: Uint8Array
    ) {

        if (bytes.length !== UniversalKey.LENGTH) {
            throw new Error("Universal Key must contain 16 bytes.");
        }

    }

    isSmpte(): boolean {

        return (
            this.bytes[0] === 0x06 &&
            this.bytes[1] === 0x0E &&
            this.bytes[2] === 0x2B &&
            this.bytes[3] === 0x34
        );

    }

    equals(other: UniversalKey): boolean {

        return this.bytes.every((v, i) => v === other.bytes[i]);

    }

    toHex(separator = ""): string {

        return Array.from(this.bytes)
            .map(b => b.toString(16).padStart(2, "0"))
            .join(separator);

    }

}