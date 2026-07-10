import { KlvMetadata } from "../KlvMetadata";
import { KlvPacket } from "../packet/KlvPacket";
import { Decoder } from "./Decoder";

export class DecoderRegistry {

    private readonly decoders =
        new Map<string, Decoder<any>>();

    register<T>(decoder: Decoder<T>): void {

        this.decoders.set(
            decoder.key.toString(),
            decoder
        );

    }

    decode(packet: KlvPacket): KlvMetadata {

        const decoder = this.decoders.get(
            packet.key.toString()
        );

        if (!decoder) {
            return packet as unknown as KlvMetadata;
        }

        return decoder.decode(packet);

    }

}
