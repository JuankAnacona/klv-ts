import { describe, expect, it } from "vitest";
import { DecoderRegistry, KlvParser, Misb0601Decoder } from "../src";

const UAS_KEY = [
    0x06, 0x0E, 0x2B, 0x34, 0x02, 0x0B, 0x01, 0x01,
    0x0E, 0x01, 0x03, 0x01, 0x01, 0x00, 0x00, 0x00
];

describe("KlvParser", () => {

    it("Should parse a KLV packet", () => {

        const bytes = Uint8Array.from([
            ...UAS_KEY,

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

    it("Should parse multiple KLV packets with parseAll", () => {

        const packetA = Uint8Array.from([
            ...UAS_KEY,
            0x01,
            0xAA
        ]);

        const packetB = Uint8Array.from([
            ...UAS_KEY,
            0x02,
            0xBB, 0xCC
        ]);

        const stream = Uint8Array.from([...packetA, ...packetB]);

        const packets = new KlvParser().parseAll(stream);

        expect(packets.length).toBe(2);
        expect(packets[0].length).toBe(1);
        expect(packets[1].length).toBe(2);
        expect(Array.from(packets[1].value)).toEqual([0xBB, 0xCC]);

    });

    it("Should require parseAll when input contains more than one packet", () => {

        const packetA = Uint8Array.from([
            ...UAS_KEY,
            0x01,
            0xAA
        ]);

        const packetB = Uint8Array.from([
            ...UAS_KEY,
            0x01,
            0xBB
        ]);

        const stream = Uint8Array.from([...packetA, ...packetB]);

        expect(() => new KlvParser().parse(stream)).toThrow("Use parseAll()");

    });

    it("Should decode MISB 0601 Local Set values", () => {

        const localSet = Uint8Array.from([
            // Tag 2: Precision Timestamp (8 bytes)
            0x02, 0x08, 0x00, 0x00, 0x01, 0x94, 0xD8, 0xB6, 0x2F, 0x80,

            // Tag 3: Mission ID
            0x03, 0x04, 0x54, 0x45, 0x53, 0x54,

            // Tag 5: Platform Heading (2 bytes)
            0x05, 0x02, 0x80, 0x00,

            // Tag 13: Sensor Latitude (4 bytes around 0)
            0x0D, 0x04, 0x00, 0x00, 0x00, 0x00
        ]);

        const packet = Uint8Array.from([
            ...UAS_KEY,
            localSet.length,
            ...localSet
        ]);

        const parsed = new KlvParser().parse(packet);
        const registry = new DecoderRegistry();
        registry.register(new Misb0601Decoder());

        const decoded = registry.decode(parsed);

        if (!decoded || typeof decoded !== "object" || !("elements" in decoded)) {
            throw new Error("Expected MISB decoded local set.");
        }

        const elements = (decoded as { elements: Array<{ name: string; value: unknown }> }).elements;

        expect(elements.find((e) => e.name === "missionId")?.value).toBe("TEST");
        expect(elements.find((e) => e.name === "precisionTimestamp")?.value).toBe(1738802605952n);
        expect(elements.find((e) => e.name === "platformHeadingAngle")?.value).toBeCloseTo(180, 1);
        expect(elements.find((e) => e.name === "sensorLatitude")?.value).toBeCloseTo(0, 5);

    });

});

