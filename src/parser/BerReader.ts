import { ByteReader } from "./ByteReader";

export class BerReader {

    static readLength(reader: ByteReader): number {

        const first = reader.readByte();

        // Short form
        if ((first & 0x80) === 0) {
            return first;
        }

        const octets = first & 0x7F;

        if (octets === 0) {
            throw new Error("Indefinite BER lengths are not supported.");
        }

        let length = 0;

        for (let i = 0; i < octets; i++) {
            length = (length << 8) | reader.readByte();
        }

        return length;
    }

}