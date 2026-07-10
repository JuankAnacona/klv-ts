import { KlvPacket } from "../packet/KlvPacket";
import { UniversalKey } from "../parser/UniversalKey";

export interface Decoder<T = unknown> {

    readonly name: string;

    readonly key: UniversalKey;

    canDecode(packet: KlvPacket): boolean;

    decode(packet: KlvPacket): T;

}
