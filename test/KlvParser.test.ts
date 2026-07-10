import { describe, expect, it } from "vitest";
import { Klv, Misb0601Metadata } from "../src";

const UAS_KEY = [
    0x06, 0x0E, 0x2B, 0x34,
    0x02, 0x0B, 0x01, 0x01,
    0x0E, 0x01, 0x03, 0x01,
    0x01, 0x00, 0x00, 0x00
];

describe("Klv", () => {

    it("Should read a KLV packet", () => {

        const bytes = Uint8Array.from([
            ...UAS_KEY,
            0x04,
            0x11, 0x22, 0x33, 0x44
        ]);

        const packet = Klv.read(bytes);

        expect(packet.length).toBe(4);
        expect(packet.key.isSmpte()).toBe(true);
        expect(Array.from(packet.value)).toEqual([
            0x11, 0x22, 0x33, 0x44
        ]);

    });

    it("Should read multiple KLV packets", () => {

        const packetA = Uint8Array.from([
            ...UAS_KEY,
            0x01,
            0xAA
        ]);

        const packetB = Uint8Array.from([
            ...UAS_KEY,
            0x02,
            0xBB,
            0xCC
        ]);

        const packets = Klv.readAll(
            Uint8Array.from([...packetA, ...packetB])
        );

        expect(packets).toHaveLength(2);

        expect(packets[0].length).toBe(1);
        expect(Array.from(packets[0].value)).toEqual([0xAA]);

        expect(packets[1].length).toBe(2);
        expect(Array.from(packets[1].value)).toEqual([0xBB, 0xCC]);

    });

    it("Should require readAll when stream contains multiple packets", () => {

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

        expect(() =>
            Klv.read(
                Uint8Array.from([...packetA, ...packetB])
            )
        ).toThrow("Use parseAll()");

    });

    it("Should decode MISB ST0601 metadata", () => {

        const localSet = Uint8Array.from([

            // Precision Timestamp
            0x02, 0x08,
            0x00, 0x00, 0x01, 0x94,
            0xD8, 0xB6, 0x2F, 0x80,

            // Mission Id
            0x03, 0x04,
            0x54, 0x45, 0x53, 0x54,

            // Platform Heading
            0x05, 0x02,
            0x80, 0x00,

            // Sensor Latitude
            0x0D, 0x04,
            0x00, 0x00, 0x00, 0x00

        ]);

        const metadata = Klv.parse<Misb0601Metadata>(
            Uint8Array.from([
                ...UAS_KEY,
                localSet.length,
                ...localSet
            ])
        );

        expect(metadata.missionId).toBe("TEST");
        expect(metadata.precisionTimestamp).toBe(1738802605952n);
        expect(metadata.platformHeadingAngle).toBeCloseTo(180, 1);
        expect(metadata.sensorLatitude).toBeCloseTo(0, 5);

    });

    it("Should decode unknown tags", () => {

        const localSet = Uint8Array.from([
            0x81, 0x0E,
            0x02,
            0xAA,
            0xBB
        ]);

        const metadata = Klv.parse<Misb0601Metadata>(
            Uint8Array.from([
                ...UAS_KEY,
                localSet.length,
                ...localSet
            ])
        );

        expect(metadata.unknownTag142).toBeInstanceOf(Uint8Array);

        expect(
            Array.from(metadata.unknownTag142 as Uint8Array)
        ).toEqual([0xAA, 0xBB]);

    });

    it("Should decode mapped limits", () => {

        const localSet = Uint8Array.from([

            // Platform Pitch Angle
            0x06, 0x02,
            0x7F, 0xFF,

            // Platform Roll Angle
            0x07, 0x02,
            0x80, 0x01,

            // Sensor Longitude
            0x0E, 0x04,
            0x80, 0x00, 0x00, 0x01

        ]);

        const metadata = Klv.parse<Misb0601Metadata>(
            Uint8Array.from([
                ...UAS_KEY,
                localSet.length,
                ...localSet
            ])
        );

        expect(metadata.platformPitchAngle).toBeCloseTo(20, 1);
        expect(metadata.platformRollAngle).toBeCloseTo(-50, 1);
        expect(metadata.sensorLongitude).toBeCloseTo(-180, 1);

    });

});
