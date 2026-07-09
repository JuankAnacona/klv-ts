import { KlvPacket } from "../packet/KlvPacket";
import { BerReader } from "./BerReader";
import { ByteReader } from "./ByteReader";
import { UniversalKey } from "./UniversalKey";

export class KlvParser {

    parse(data: Uint8Array): KlvPacket {

        const reader = new ByteReader(data);

        const keyBytes = reader.readBytes(UniversalKey.LENGTH);

        const key = new UniversalKey(keyBytes);

        const length = BerReader.readLength(reader);

        const value = reader.readBytes(length);

        return {

            key,

            length,

            value,

            raw: data

        };

    }

}