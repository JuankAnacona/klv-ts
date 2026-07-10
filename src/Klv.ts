import { KlvParser } from "./parser/KlvParser";
import { DecoderRegistry } from "./decoder/DecoderRegistry";
import { Misb0601Decoder } from "./decoder/misb0601/Misb0601Decoder";
import { KlvPacket } from "./packet/KlvPacket";

export class Klv {

    private static readonly parser = new KlvParser();

    private static readonly registry = new DecoderRegistry();

    static {

        this.registry.register(new Misb0601Decoder());

    }

    static parse<T>(bytes: Uint8Array): T {

        const packet = this.parser.parse(bytes);

        return this.registry.decode<T>(packet);

    }

    static parseAll<T>(bytes: Uint8Array): T[] {

        return this.parser
            .parseAll(bytes)
            .map(packet => this.registry.decode<T>(packet));

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

}
