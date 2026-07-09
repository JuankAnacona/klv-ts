import { KlvPacket } from "../packet/KlvPacket";
import { BerReader } from "./BerReader";
import { ByteReader } from "./ByteReader";
import { UniversalKey } from "./UniversalKey";
import { KlvParseError } from "../errors/KlvParseError";

export class KlvParser {

    parse(data: Uint8Array): KlvPacket {

        const packets = this.parseAll(data);

        if (packets.length === 0) {
            throw new KlvParseError("No KLV packet found.", 0);
        }

        if (packets.length > 1) {
            throw new KlvParseError("Input contains multiple KLV packets. Use parseAll().", packets[0].raw.length);
        }

        return packets[0];

    }

    parseAll(data: Uint8Array): KlvPacket[] {

        const reader = new ByteReader(data);
        const packets: KlvPacket[] = [];

        while (reader.remaining > 0) {

            const packetStart = reader.position;

            const keyBytes = reader.readBytes(UniversalKey.LENGTH);
            const key = new UniversalKey(keyBytes);

            if (!key.isSmpte()) {
                throw new KlvParseError("Input does not start with a SMPTE universal key.", packetStart);
            }

            const length = BerReader.readLength(reader);
            const value = reader.readBytes(length);
            const packetEnd = reader.position;

            packets.push({
                key,
                length,
                value,
                raw: data.slice(packetStart, packetEnd)
            });

        }

        return packets;

    }

}
