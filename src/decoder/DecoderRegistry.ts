import { KlvPacket } from "../packet/KlvPacket";
import { Decoder } from "./Decoder";

export class DecoderRegistry {

    private readonly decoders: Decoder[] = [];

    register(decoder: Decoder): void {
        this.decoders.push(decoder);
    }

    decode<T>(packet: KlvPacket): T {

        for (const decoder of this.decoders) {

            if (decoder.canDecode(packet)) {
                return decoder.decode(packet) as T;
            }

        }

        return packet as unknown as T;
    }

}
