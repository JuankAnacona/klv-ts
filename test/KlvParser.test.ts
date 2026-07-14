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

        const metadata = Klv.parse(
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

        const metadata = Klv.parse(
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

        const metadata = Klv.parse(
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

     it("Should decode JSON ", () => {

        const jsonklv = {
  "pid": 67,
  "stream_id": 189,
  "len": 259,
  "data": {
    "0": 6,
    "1": 14,
    "2": 43,
    "3": 52,
    "4": 2,
    "5": 11,
    "6": 1,
    "7": 1,
    "8": 14,
    "9": 1,
    "10": 3,
    "11": 1,
    "12": 1,
    "13": 0,
    "14": 0,
    "15": 0,
    "16": 129,
    "17": 241,
    "18": 2,
    "19": 8,
    "20": 0,
    "21": 4,
    "22": 202,
    "23": 20,
    "24": 40,
    "25": 101,
    "26": 106,
    "27": 65,
    "28": 3,
    "29": 21,
    "30": 69,
    "31": 83,
    "32": 82,
    "33": 73,
    "34": 95,
    "35": 77,
    "36": 101,
    "37": 116,
    "38": 97,
    "39": 100,
    "40": 97,
    "41": 116,
    "42": 97,
    "43": 95,
    "44": 67,
    "45": 111,
    "46": 108,
    "47": 108,
    "48": 101,
    "49": 99,
    "50": 116,
    "51": 4,
    "52": 6,
    "53": 78,
    "54": 57,
    "55": 55,
    "56": 56,
    "57": 50,
    "58": 54,
    "59": 5,
    "60": 2,
    "61": 103,
    "62": 249,
    "63": 6,
    "64": 2,
    "65": 33,
    "66": 25,
    "67": 7,
    "68": 2,
    "69": 224,
    "70": 57,
    "71": 10,
    "72": 5,
    "73": 67,
    "74": 50,
    "75": 48,
    "76": 56,
    "77": 66,
    "78": 11,
    "79": 0,
    "80": 12,
    "81": 0,
    "82": 13,
    "83": 4,
    "84": 58,
    "85": 113,
    "86": 86,
    "87": 158,
    "88": 14,
    "89": 4,
    "90": 181,
    "91": 109,
    "92": 87,
    "93": 255,
    "94": 15,
    "95": 2,
    "96": 49,
    "97": 82,
    "98": 16,
    "99": 2,
    "100": 4,
    "101": 92,
    "102": 17,
    "103": 2,
    "104": 2,
    "105": 115,
    "106": 18,
    "107": 4,
    "108": 183,
    "109": 98,
    "110": 34,
    "111": 35,
    "112": 19,
    "113": 4,
    "114": 245,
    "115": 157,
    "116": 221,
    "117": 222,
    "118": 20,
    "119": 4,
    "120": 0,
    "121": 0,
    "122": 0,
    "123": 0,
    "124": 21,
    "125": 4,
    "126": 0,
    "127": 29,
    "128": 221,
    "129": 22,
    "130": 22,
    "131": 2,
    "132": 0,
    "133": 0,
    "134": 23,
    "135": 4,
    "136": 58,
    "137": 117,
    "138": 244,
    "139": 33,
    "140": 24,
    "141": 4,
    "142": 181,
    "143": 112,
    "144": 119,
    "145": 219,
    "146": 25,
    "147": 2,
    "148": 35,
    "149": 169,
    "150": 26,
    "151": 2,
    "152": 1,
    "153": 129,
    "154": 27,
    "155": 2,
    "156": 0,
    "157": 54,
    "158": 28,
    "159": 2,
    "160": 0,
    "161": 31,
    "162": 29,
    "163": 2,
    "164": 1,
    "165": 254,
    "166": 30,
    "167": 2,
    "168": 254,
    "169": 124,
    "170": 31,
    "171": 2,
    "172": 255,
    "173": 169,
    "174": 32,
    "175": 2,
    "176": 255,
    "177": 227,
    "178": 33,
    "179": 2,
    "180": 254,
    "181": 32,
    "182": 47,
    "183": 1,
    "184": 0,
    "185": 48,
    "186": 42,
    "187": 1,
    "188": 1,
    "189": 1,
    "190": 2,
    "191": 1,
    "192": 1,
    "193": 3,
    "194": 4,
    "195": 47,
    "196": 47,
    "197": 67,
    "198": 65,
    "199": 4,
    "200": 0,
    "201": 5,
    "202": 0,
    "203": 6,
    "204": 2,
    "205": 67,
    "206": 65,
    "207": 21,
    "208": 16,
    "209": 0,
    "210": 0,
    "211": 0,
    "212": 0,
    "213": 0,
    "214": 0,
    "215": 0,
    "216": 0,
    "217": 0,
    "218": 0,
    "219": 0,
    "220": 0,
    "221": 0,
    "222": 0,
    "223": 0,
    "224": 0,
    "225": 22,
    "226": 2,
    "227": 0,
    "228": 5,
    "229": 56,
    "230": 1,
    "231": 0,
    "232": 59,
    "233": 8,
    "234": 70,
    "235": 105,
    "236": 114,
    "237": 101,
    "238": 98,
    "239": 105,
    "240": 114,
    "241": 100,
    "242": 65,
    "243": 1,
    "244": 1,
    "245": 72,
    "246": 8,
    "247": 0,
    "248": 0,
    "249": 0,
    "250": 0,
    "251": 0,
    "252": 0,
    "253": 0,
    "254": 0,
    "255": 1,
    "256": 2,
    "257": 192,
    "258": 188
  }
};

       const metadata = Klv.parseJsonKlv(jsonklv);
       expect(metadata.missionId).toBe("ESRI_Metadata_Collect");


    });

});
