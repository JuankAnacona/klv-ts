import { Decoder } from "./Decoder";
import { KlvPacket } from "../packet/KlvPacket";

export class UnknownDecoder implements Decoder<KlvPacket> {

    readonly name = "Unknown";

    canDecode(_packet: KlvPacket): boolean {
        return true;
    }

    decode(packet: KlvPacket): KlvPacket {
        return packet;
    }

}
