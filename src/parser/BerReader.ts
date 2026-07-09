import { ByteReader } from "./ByteReader";
import { KlvParseError } from "../errors/KlvParseError";

export class BerReader {

    static readLength(reader: ByteReader): number {

        const first = reader.readByte();

        // Short form
        if ((first & 0x80) === 0) {
            return first;
        }

        const octets = first & 0x7F;

        if (octets === 0) {
            throw new KlvParseError("Indefinite BER lengths are not supported.", reader.position - 1);
        }

        // JavaScript numbers can exactly represent integers up to 2^53 - 1.
        if (octets > 6) {
            throw new KlvParseError(`BER length uses too many octets (${octets}).`, reader.position - 1);
        }

        let length = 0;

        for (let i = 0; i < octets; i++) {
            length = (length << 8) | reader.readByte();
        }

        return length;
    }

}
