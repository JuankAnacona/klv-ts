import { UniversalKey } from "../parser/UniversalKey";

export interface KlvPacket {
    key: UniversalKey;
    length: number;
    value: Uint8Array;
    raw: Uint8Array;
}