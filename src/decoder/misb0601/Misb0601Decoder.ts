import { LocalSetParser } from "../../parser/LocalSetParser";
import { Decoder } from "../Decoder";
import { KlvPacket } from "../../packet/KlvPacket";
import { UniversalKey } from "../../parser/UniversalKey";
import { MISB_0601_TAGS } from "./Misb0601Tags";
import { Misb0601Definition } from "./Misb0601Definition";
import { Misb0601Metadata } from "./Misb0601Metadata";

export interface Misb0601DecodedElement {
    tag: number;
    length: number;
    name: string;
    displayName: string;
    units?: string;
    value: unknown;
    rawValue: Uint8Array;
}


export class Misb0601Decoder implements Decoder<Misb0601Metadata> {
     readonly key = new UniversalKey(Uint8Array.from([
        0x06,0x0E,0x2B,0x34,
        0x02,0x0B,0x01,0x01,
        0x0E,0x01,0x03,0x01,
        0x01,0x00,0x00,0x00
    ]));

    readonly name = "MISB ST 0601";

    private static readonly UAS_DATALINK_LOCAL_SET_KEY = new UniversalKey(Uint8Array.from([
        0x06, 0x0E, 0x2B, 0x34,
        0x02, 0x0B, 0x01, 0x01,
        0x0E, 0x01, 0x03, 0x01,
        0x01, 0x00, 0x00, 0x00
    ]));

    canDecode(packet: KlvPacket): boolean {
        return packet.key.equals(Misb0601Decoder.UAS_DATALINK_LOCAL_SET_KEY);
    }

    decode(packet: KlvPacket): Misb0601Metadata {

        const localSet = new LocalSetParser().parse(packet.value);

        const elements: Misb0601DecodedElement[] = localSet.elements.map((element) => {
            const definition : Misb0601Definition | undefined = MISB_0601_TAGS.get(element.tag);
            if (!definition) {
                return {
                    tag: element.tag,
                    length: element.length,
                    name: `unknownTag${element.tag}`,
                    displayName: `Unknown Tag ${element.tag}`,
                    value: element.value,
                    rawValue: element.value
                };
            }

            return {
                tag: element.tag,
                length: element.length,
                name: definition.name,
                displayName: definition.displayName,
                units: definition.units,
                value: definition.decoder(element.value),
                rawValue: element.value
            };
        });
        const metadata = new Misb0601Metadata(packet);

        for (const element of elements) {
            metadata[element.name] = element.value;
        }
        return metadata;


    }

}
