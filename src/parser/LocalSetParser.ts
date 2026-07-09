import { ByteReader } from "./ByteReader";
import { BerReader } from "./BerReader";
import { LocalSet } from "../packet/LocalSet";
import { KlvElement } from "../packet/KlvElement";
import { KlvParseError } from "../errors/KlvParseError";

export class LocalSetParser {

    private readTag(reader: ByteReader): number {

        const first = reader.readByte();

        if ((first & 0x80) === 0) {
            return first;
        }

        let tag = first & 0x7F;
        let octets = 1;

        while (true) {
            const next = reader.readByte();
            octets++;
            tag = (tag << 7) | (next & 0x7F);

            if ((next & 0x80) === 0) {
                return tag;
            }

            if (octets > 5) {
                throw new KlvParseError("BER tag uses too many octets.", reader.position - 1);
            }
        }

    }

    parse(data: Uint8Array): LocalSet {

        const reader = new ByteReader(data);

        const elements: KlvElement[] = [];

        while (reader.remaining > 0) {

            const tag = this.readTag(reader);

            const length = BerReader.readLength(reader);

            const value = reader.readBytes(length);

            elements.push({
                tag,
                length,
                value
            });

        }

        return {
            elements
        };

    }

}
