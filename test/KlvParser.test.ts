import { describe, expect, it } from "vitest";
import { KlvParser } from "../src";

describe("KlvParser", () => {

    it("Should parse a KLV packet", () => {

        const bytes = Uint8Array.from([
            0x06,0x0E,0x2B,0x34,0x02,0x0B,0x01,0x01,
            0x0E,0x01,0x03,0x01,0x01,0x00,0x00,0x00,

            // BER Length
            0x04,

            // Value
            0x11,0x22,0x33,0x44
        ]);

        const parser = new KlvParser();

        const packet = parser.parse(bytes);

        expect(packet.length).toBe(4);

        expect(packet.key.isSmpte()).toBe(true);

        expect(packet.value.length).toBe(4);

    });

});