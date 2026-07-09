import { KlvPacket } from "../packet/KlvPacket";

export interface Decoder<T = unknown> {

    readonly name: string;

    canDecode(packet: KlvPacket): boolean;

    decode(packet: KlvPacket): T;

}
