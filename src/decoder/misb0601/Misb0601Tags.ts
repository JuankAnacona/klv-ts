import { KlvParseError } from "../../errors/KlvParseError";
import { Misb0601Definition } from "./Misb0601Definition";

const RAW_DECODER = (value: Uint8Array): Uint8Array => value;

type TagEntry = readonly [id: number, name: string];

const TAG_ENTRIES: readonly TagEntry[] = [
	[0, "Undefined"],
	[1, "Checksum"],
	[2, "PrecisionTimeStamp"],
	[3, "MissionId"],
	[4, "PlatformTailNumber"],
	[5, "PlatformHeadingAngle"],
	[6, "PlatformPitchAngle"],
	[7, "PlatformRollAngle"],
	[8, "PlatformTrueAirspeed"],
	[9, "PlatformIndicatedAirspeed"],
	[10, "PlatformDesignation"],
	[11, "ImageSourceSensor"],
	[12, "ImageCoordinateSystem"],
	[13, "SensorLatitude"],
	[14, "SensorLongitude"],
	[15, "SensorTrueAltitude"],
	[16, "SensorHorizontalFov"],
	[17, "SensorVerticalFov"],
	[18, "SensorRelativeAzimuthAngle"],
	[19, "SensorRelativeElevationAngle"],
	[20, "SensorRelativeRollAngle"],
	[21, "SlantRange"],
	[22, "TargetWidth"],
	[23, "FrameCenterLatitude"],
	[24, "FrameCenterLongitude"],
	[25, "FrameCenterElevation"],
	[26, "OffsetCornerLatitudePoint1"],
	[27, "OffsetCornerLongitudePoint1"],
	[28, "OffsetCornerLatitudePoint2"],
	[29, "OffsetCornerLongitudePoint2"],
	[30, "OffsetCornerLatitudePoint3"],
	[31, "OffsetCornerLongitudePoint3"],
	[32, "OffsetCornerLatitudePoint4"],
	[33, "OffsetCornerLongitudePoint4"],
	[34, "IcingDetected"],
	[35, "WindDirection"],
	[36, "WindSpeed"],
	[37, "StaticPressure"],
	[38, "DensityAltitude"],
	[39, "OutsideAirTemp"],
	[40, "TargetLocationLatitude"],
	[41, "TargetLocationLongitude"],
	[42, "TargetLocationElevation"],
	[43, "TargetTrackGateWidth"],
	[44, "TargetTrackGateHeight"],
	[45, "TargetErrorCe90"],
	[46, "TargetErrorLe90"],
	[47, "GenericFlagData01"],
	[48, "SecurityLocalMetadataSet"],
	[49, "DifferentialPressure"],
	[50, "PlatformAngleOfAttack"],
	[51, "PlatformVerticalSpeed"],
	[52, "PlatformSideslipAngle"],
	[53, "AirfieldBarometricPressure"],
	[54, "AirfieldElevation"],
	[55, "RelativeHumidity"],
	[56, "PlatformGroundSpeed"],
	[57, "GroundRange"],
	[58, "PlatformFuelRemaining"],
	[59, "PlatformCallSign"],
	[60, "WeaponLoad"],
	[61, "WeaponFired"],
	[62, "LaserPrfCode"],
	[63, "SensorFovName"],
	[64, "PlatformMagneticHeading"],
	[65, "UasLdsVersionNumber"],
	[66, "TargetLocationCovariance"],
	[67, "AlternatePlatformLatitude"],
	[68, "AlternatePlatformLongitude"],
	[69, "AlternatePlatformAltitude"],
	[70, "AlternatePlatformName"],
	[71, "AlternatePlatformHeading"],
	[72, "EventStartTimeUtc"],
	[73, "RvtLocalDataSet"],
	[74, "VmtiLocalDataSet"],
	[75, "SensorEllipsoidHeight"],
	[76, "AlternatePlatformEllipsoidHeight"],
	[77, "OperationalMode"],
	[78, "FrameCenterHae"],
	[79, "SensorNorthVelocity"],
	[80, "SensorEastVelocity"],
	[81, "ImageHorizonPixelPack"],
	[82, "CornerLatPt1"],
	[83, "CornerLonPt1"],
	[84, "CornerLatPt2"],
	[85, "CornerLonPt2"],
	[86, "CornerLatPt3"],
	[87, "CornerLonPt3"],
	[88, "CornerLatPt4"],
	[89, "CornerLonPt4"],
	[90, "PlatformPitchAngleFull"],
	[91, "PlatformRollAngleFull"],
	[92, "PlatformAngleOfAttackFull"],
	[93, "PlatformSideSlipAngle"],
	[94, "MiisCoreIdentifier"],
	[95, "SarMotionImageryMetadata"],
	[96, "TargetWidthExtended"],
	[97, "RangeImage"],
	[98, "Georegistration"],
	[99, "CompositeImaging"],
	[100, "Segment"],
	[101, "Amend"],
	[102, "SdccFlp"],
	[103, "DensityAltitudeExtended"],
	[104, "SensorEllipsoidHeightExtended"],
	[105, "AlternatePlatformEllipsoidHeightExtended"],
	[106, "StreamDesignator"],
	[107, "OperationalBase"],
	[108, "BroadcastSource"],
	[109, "RangeToRecoveryLocation"],
	[110, "TimeAirborne"],
	[111, "PropulsionUnitSpeed"],
	[112, "PlatformCourseAngle"],
	[113, "AltitudeAgl"],
	[114, "RadarAltimeter"],
	[115, "ControlCommand"],
	[116, "ControlCommandVerification"],
	[117, "SensorAzimuthRate"],
	[118, "SensorElevationRate"],
	[119, "SensorRollRate"],
	[120, "OnBoardMiStoragePercentFull"],
	[121, "ActiveWavelengthList"],
	[122, "CountryCodes"],
	[123, "NumberNavsatsInView"],
	[124, "PositioningMethodSource"],
	[125, "PlatformStatus"],
	[126, "SensorControlMode"],
	[127, "SensorFrameRatePack"],
	[128, "WavelengthsList"],
	[129, "TargetId"],
	[130, "AirbaseLocations"],
	[131, "TakeOffTime"],
	[132, "TransmissionFrequency"],
	[133, "OnBoardMiStorageCapacity"],
	[134, "ZoomPercentage"],
	[135, "CommunicationsMethod"],
	[136, "LeapSeconds"],
	[137, "CorrectionOffset"],
	[138, "PayloadList"],
	[139, "ActivePayloads"],
	[140, "WeaponsStores"],
	[141, "WaypointList"]
];

const toDisplayName = (name: string): string =>
	name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.trim();

export const MISB_0601_TAGS = new Map<number, Misb0601Definition>(
	TAG_ENTRIES.map(([id, name]) => [
		id,
		{
			id,
			name,
			displayName: toDisplayName(name),
			decoder: RAW_DECODER
		}
	])
);

export const MIS_0601_TAG_IDS = TAG_ENTRIES.map(([id]) => id);

export function getMisb0601Definition(tag: number): Misb0601Definition | undefined {
	return MISB_0601_TAGS.get(tag);
}


const textDecoder = new TextDecoder("utf-8");

function requireLength(value: Uint8Array, expected: number): void {
	if (value.length !== expected) {
		throw new KlvParseError(`Invalid value length ${value.length}. Expected ${expected}.`);
	}
}

function toUnsigned(value: Uint8Array): number {
	let result = 0;
	for (const byte of value) {
		result = (result * 256) + byte;
	}
	return result;
}

function toSigned(value: Uint8Array): number {
	const unsigned = toUnsigned(value);
	const bits = value.length * 8;
	const signThreshold = Math.pow(2, bits - 1);

	if (unsigned < signThreshold) {
		return unsigned;
	}

	return unsigned - Math.pow(2, bits);
}

function readU64(value: Uint8Array): bigint {
	requireLength(value, 8);

	let result = 0n;
	for (const byte of value) {
		result = (result << 8n) | BigInt(byte);
	}
	return result;
}

function mapUnsigned(value: Uint8Array, min: number, max: number): number {
	const raw = toUnsigned(value);
	const maxRaw = Math.pow(2, value.length * 8) - 1;
	return min + ((max - min) * raw / maxRaw);
}

function mapSigned(value: Uint8Array, min: number, max: number): number {
	const raw = toSigned(value);
	const bits = value.length * 8;
	const maxRaw = Math.pow(2, bits - 1) - 1;
	const minRaw = -maxRaw;
	return min + ((max - min) * (raw - minRaw) / (maxRaw - minRaw));
}

function readString(value: Uint8Array): string {
	return textDecoder.decode(value).replace(/\0+$/, "").trim();
}
