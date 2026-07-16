import { KlvParser } from "./parser/KlvParser";
import { DecoderRegistry } from "./decoder/DecoderRegistry";
import { Misb0601Decoder } from "./decoder/misb0601/Misb0601Decoder";
import { KlvPacket } from "./packet/KlvPacket";
import { KlvMetadata } from "./KlvMetadata";

export class Klv {

    private static readonly parser = new KlvParser();

    private static readonly registry = new DecoderRegistry();

    static {

        this.registry.register(new Misb0601Decoder());

    }

    static parse(bytes: Uint8Array): KlvMetadata {

        const packet = this.parser.parse(bytes);

        return this.registry.decode(packet);

    }

    static parseAll(bytes: Uint8Array): KlvMetadata[] {

        return this.parser
            .parseAll(bytes)
            .map(packet => this.registry.decode(packet));

    }

    static read(bytes: Uint8Array): KlvPacket {

        return this.parser.parse(bytes);

    }

    static readAll(bytes: Uint8Array): KlvPacket[] {
        return this.parser.parseAll(bytes);
    }

    static register(decoder: any): void {

        this.registry.register(decoder);

    }

    static parseJsonKlv(packet: {
        pid: number;
        stream_id: number;
        len: number;
        data: Record<string, number> | Uint8Array;
    }) {
        let bytes: Uint8Array;

        if (packet.data instanceof Uint8Array) {
            bytes = packet.data;
        } else {
            bytes = Uint8Array.from(Object.values(packet.data));
        }

        return this.parse(bytes);
    }

}
