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

    it("Should decode edge cases and different mapped types", () => {

        const localSet = Uint8Array.from([
            // Tag 6: Platform Pitch Angle (2 bytes) -> min value 0x8001 -> -20 degrees
            0x06, 0x02, 0x80, 0x01,

            // Tag 7: Platform Roll Angle (2 bytes) -> max value 0x7FFF -> 50 degrees
            0x07, 0x02, 0x7F, 0xFF,

            // Tag 8: Platform True Airspeed (1 byte) -> 255
            0x08, 0x01, 0xFF,

            // Tag 14: Sensor Longitude (4 bytes) -> max value 0x7FFFFFFF -> 180 degrees
            0x0E, 0x04, 0x7F, 0xFF, 0xFF, 0xFF,

            // Tag 21: Slant Range (4 bytes) -> max value 0xFFFFFFFF -> 5000000 meters
            0x15, 0x04, 0xFF, 0xFF, 0xFF, 0xFF,

            // Tag 57: Ground Range (4 bytes) -> 0x00112233 -> 1122867
            0x39, 0x04, 0x00, 0x11, 0x22, 0x33,

            // Tag 999 (Unknown Tag): should default to RAW_DECODER and name "unknownTag999"
            0x0F, 0x02, 0xAB, 0xCD // Note: using Tag 15 (SensorTrueAltitude) in raw KLV to simulate unknown behavior if unregistered, or let's use a tag that is not defined in TAG_ENTRIES. Tag 142 is not defined.
        ]);

        const customLocalSet = Uint8Array.from([
            // Tag 142 (142 = 0x81, 0x0E in BER OID encoding), length 2, value [0xAA, 0xBB]
            0x81, 0x0E, 0x02, 0xAA, 0xBB
        ]);

        const packet = Uint8Array.from([
            ...UAS_KEY,
            customLocalSet.length,
            ...customLocalSet
        ]);

        const parsed = new KlvParser().parse(packet);
        const registry = new DecoderRegistry();
        registry.register(new Misb0601Decoder());

        const decoded = registry.decode(parsed) as { elements: Array<{ name: string; value: unknown }> };
        const unknownEl = decoded.elements.find((e) => e.name === "unknownTag142");

        expect(unknownEl).toBeDefined();
        expect(unknownEl?.value).toBeInstanceOf(Uint8Array);
        expect(Array.from(unknownEl?.value as Uint8Array)).toEqual([0xAA, 0xBB]);

    });

    it("Should decode limits for mapped values", () => {
        const localSet = Uint8Array.from([
            // Tag 6: Platform Pitch Angle (2 bytes) -> max value 0x7FFF -> 20 degrees
            0x06, 0x02, 0x7F, 0xFF,

            // Tag 7: Platform Roll Angle (2 bytes) -> min value 0x8001 -> -50 degrees
            0x07, 0x02, 0x80, 0x01,

            // Tag 14: Sensor Longitude (4 bytes) -> min value 0x80000001 -> -180 degrees
            0x0E, 0x04, 0x80, 0x00, 0x00, 0x01
        ]);

        const packet = Uint8Array.from([
            ...UAS_KEY,
            localSet.length,
            ...localSet
        ]);

        const parsed = new KlvParser().parse(packet);
        const registry = new DecoderRegistry();
        registry.register(new Misb0601Decoder());

        const decoded = registry.decode(parsed) as { elements: Array<{ name: string; value: unknown }> };

        expect(decoded.elements.find((e) => e.name === "platformPitchAngle")?.value).toBeCloseTo(20, 1);
        expect(decoded.elements.find((e) => e.name === "platformRollAngle")?.value).toBeCloseTo(-50, 1);
        expect(decoded.elements.find((e) => e.name === "sensorLongitude")?.value).toBeCloseTo(-180, 1);
    });

});

