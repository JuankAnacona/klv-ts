import { KlvParseError } from "../../errors/KlvParseError";
import { DecoderFunction, Misb0601Definition } from "./Misb0601Definition";

import {
	RAW_DECODER,
	STRING_DECODER,
	UINT8_DECODER,
	UINT16_DECODER,
	UINT32_DECODER,
	UINT64_DECODER,
	PLATFORM_HEADING_DECODER,
	LATITUDE_DECODER,
	LONGITUDE_DECODER,
	PITCH_DECODER,
	ROLL_DECODER,
	ANGLE_360_DECODER,
	ANGLE_180_DECODER,
	ELEVATION_DECODER,
	SLANT_RANGE_DECODER,
	TARGET_WIDTH_DECODER,
	FRAME_CENTER_ELEV_DECODER,
	OFFSET_CORNER_DECODER
} from "../Decoders";

type TagEntry = readonly [id: number, name: string,
	decoder?: DecoderFunction];


const TAG_ENTRIES: readonly TagEntry[] = [

	[0, "Undefined"],

	[1, "Checksum", UINT16_DECODER],

	[2, "PrecisionTimestamp", UINT64_DECODER],

	[3, "MissionId", STRING_DECODER],

	[4, "PlatformTailNumber", STRING_DECODER],

	[5, "PlatformHeadingAngle", PLATFORM_HEADING_DECODER],

	[6, "PlatformPitchAngle", PITCH_DECODER],

	[7, "PlatformRollAngle", ROLL_DECODER],

	[8, "PlatformTrueAirspeed", UINT8_DECODER],

	[9, "PlatformIndicatedAirspeed", UINT8_DECODER],

	[10, "PlatformDesignation", STRING_DECODER],

	[11, "ImageSourceSensor", STRING_DECODER],

	[12, "ImageCoordinateSystem", STRING_DECODER],

	[13, "SensorLatitude", LATITUDE_DECODER],

	[14, "SensorLongitude", LONGITUDE_DECODER],

	[15, "SensorTrueAltitude", FRAME_CENTER_ELEV_DECODER],

	[16, "SensorHorizontalFov", ANGLE_180_DECODER],

	[17, "SensorVerticalFov", ANGLE_180_DECODER],

	[18, "SensorRelativeAzimuthAngle", ANGLE_360_DECODER],

	[19, "SensorRelativeElevationAngle", ELEVATION_DECODER],
	[20, "SensorRelativeRollAngle", ANGLE_360_DECODER],
	[21, "SlantRange", SLANT_RANGE_DECODER],
	[22, "TargetWidth", TARGET_WIDTH_DECODER],
	[23, "FrameCenterLatitude", LATITUDE_DECODER],
	[24, "FrameCenterLongitude", LONGITUDE_DECODER],
	[25, "FrameCenterElevation", FRAME_CENTER_ELEV_DECODER],
	[26, "OffsetCornerLatitudePoint1", OFFSET_CORNER_DECODER],
	[27, "OffsetCornerLongitudePoint1", OFFSET_CORNER_DECODER],
	[28, "OffsetCornerLatitudePoint2", OFFSET_CORNER_DECODER],
	[29, "OffsetCornerLongitudePoint2", OFFSET_CORNER_DECODER],
	[30, "OffsetCornerLatitudePoint3", OFFSET_CORNER_DECODER],
	[31, "OffsetCornerLongitudePoint3", OFFSET_CORNER_DECODER],
	[32, "OffsetCornerLatitudePoint4", OFFSET_CORNER_DECODER],
	[33, "OffsetCornerLongitudePoint4", OFFSET_CORNER_DECODER],
	[34, "IcingDetected", UINT8_DECODER],
	[35, "WindDirection", ANGLE_360_DECODER],
	[36, "WindSpeed", UINT8_DECODER],
	[37, "StaticPressure", UINT16_DECODER],
	[38, "DensityAltitude", FRAME_CENTER_ELEV_DECODER],
	[39, "OutsideAirTemp", UINT8_DECODER],
	[40, "TargetLocationLatitude", LATITUDE_DECODER],
	[41, "TargetLocationLongitude", LONGITUDE_DECODER],
	[42, "TargetLocationElevation", FRAME_CENTER_ELEV_DECODER],
	[43, "TargetTrackGateWidth", UINT8_DECODER],
	[44, "TargetTrackGateHeight", UINT8_DECODER],
	[45, "TargetErrorCe90", UINT16_DECODER],
	[46, "TargetErrorLe90", UINT16_DECODER],
	[47, "GenericFlagData01", UINT8_DECODER],
	[48, "SecurityLocalMetadataSet", RAW_DECODER],
	[49, "DifferentialPressure", UINT16_DECODER],
	[50, "PlatformAngleOfAttack", PITCH_DECODER],
	[51, "PlatformVerticalSpeed", UINT16_DECODER],
	[52, "PlatformSideslipAngle", PITCH_DECODER],
	[53, "AirfieldBarometricPressure", UINT16_DECODER],
	[54, "AirfieldElevation", FRAME_CENTER_ELEV_DECODER],
	[55, "RelativeHumidity", UINT8_DECODER],
	[56, "PlatformGroundSpeed", UINT8_DECODER],
	[57, "GroundRange", UINT32_DECODER],
	[58, "PlatformFuelRemaining", UINT16_DECODER],
	[59, "PlatformCallSign", STRING_DECODER],
	[60, "WeaponLoad", UINT16_DECODER],
	[61, "WeaponFired", UINT8_DECODER],
	[62, "LaserPrfCode", UINT16_DECODER],
	[63, "SensorFovName", UINT8_DECODER],
	[64, "PlatformMagneticHeading", PLATFORM_HEADING_DECODER],
	[65, "UasLdsVersionNumber", UINT8_DECODER],
	[66, "TargetLocationCovariance", RAW_DECODER],
	[67, "AlternatePlatformLatitude", LATITUDE_DECODER],
	[68, "AlternatePlatformLongitude", LONGITUDE_DECODER],
	[69, "AlternatePlatformAltitude", FRAME_CENTER_ELEV_DECODER],
	[70, "AlternatePlatformName", STRING_DECODER],
	[71, "AlternatePlatformHeading", PLATFORM_HEADING_DECODER],
	[72, "EventStartTimeUtc", UINT64_DECODER],
	[73, "RvtLocalDataSet", RAW_DECODER],
	[74, "VmtiLocalDataSet", RAW_DECODER],
	[75, "SensorEllipsoidHeight", FRAME_CENTER_ELEV_DECODER],
	[76, "AlternatePlatformEllipsoidHeight", FRAME_CENTER_ELEV_DECODER],
	[77, "OperationalMode", UINT8_DECODER],
	[78, "FrameCenterHae", FRAME_CENTER_ELEV_DECODER],
	[79, "SensorNorthVelocity", UINT16_DECODER],
	[80, "SensorEastVelocity", UINT16_DECODER],
	[81, "ImageHorizonPixelPack", RAW_DECODER],
	[82, "CornerLatPt1", LATITUDE_DECODER],
	[83, "CornerLonPt1", LONGITUDE_DECODER],
	[84, "CornerLatPt2", LATITUDE_DECODER],
	[85, "CornerLonPt2", LONGITUDE_DECODER],
	[86, "CornerLatPt3", LATITUDE_DECODER],
	[87, "CornerLonPt3", LONGITUDE_DECODER],
	[88, "CornerLatPt4", LATITUDE_DECODER],
	[89, "CornerLonPt4", LONGITUDE_DECODER],
	[90, "PlatformPitchAngleFull", RAW_DECODER],
	[91, "PlatformRollAngleFull", RAW_DECODER],
	[92, "PlatformAngleOfAttackFull", RAW_DECODER],
	[93, "PlatformSideSlipAngle", RAW_DECODER],
	[94, "MiisCoreIdentifier", STRING_DECODER],
	[95, "SarMotionImageryMetadata", RAW_DECODER],
	[96, "TargetWidthExtended", RAW_DECODER],
	[97, "RangeImage", RAW_DECODER],
	[98, "Georegistration", RAW_DECODER],
	[99, "CompositeImaging", RAW_DECODER],
	[100, "Segment", RAW_DECODER],
	[101, "Amend", RAW_DECODER],
	[102, "SdccFlp", RAW_DECODER],
	[103, "DensityAltitudeExtended", RAW_DECODER],
	[104, "SensorEllipsoidHeightExtended", RAW_DECODER],
	[105, "AlternatePlatformEllipsoidHeightExtended", RAW_DECODER],
	[106, "StreamDesignator", STRING_DECODER],
	[107, "OperationalBase", STRING_DECODER],
	[108, "BroadcastSource", STRING_DECODER],
	[109, "RangeToRecoveryLocation", RAW_DECODER],
	[110, "TimeAirborne", RAW_DECODER],
	[111, "PropulsionUnitSpeed", RAW_DECODER],
	[112, "PlatformCourseAngle", RAW_DECODER],
	[113, "AltitudeAgl", RAW_DECODER],
	[114, "RadarAltimeter", RAW_DECODER],
	[115, "ControlCommand", RAW_DECODER],
	[116, "ControlCommandVerification", RAW_DECODER],
	[117, "SensorAzimuthRate", RAW_DECODER],
	[118, "SensorElevationRate", RAW_DECODER],
	[119, "SensorRollRate", RAW_DECODER],
	[120, "OnBoardMiStoragePercentFull", RAW_DECODER],
	[121, "ActiveWavelengthList", RAW_DECODER],
	[122, "CountryCodes", STRING_DECODER],
	[123, "NumberNavsatsInView", UINT8_DECODER],
	[124, "PositioningMethodSource", UINT8_DECODER],
	[125, "PlatformStatus", UINT8_DECODER],
	[126, "SensorControlMode", UINT8_DECODER],
	[127, "SensorFrameRatePack", RAW_DECODER],
	[128, "WavelengthsList", RAW_DECODER],
	[129, "TargetId", STRING_DECODER],
	[130, "AirbaseLocations", RAW_DECODER],
	[131, "TakeOffTime", UINT64_DECODER],
	[132, "TransmissionFrequency", RAW_DECODER],
	[133, "OnBoardMiStorageCapacity", RAW_DECODER],
	[134, "ZoomPercentage", RAW_DECODER],
	[135, "CommunicationsMethod", RAW_DECODER],
	[136, "LeapSeconds", UINT8_DECODER],
	[137, "CorrectionOffset", RAW_DECODER],
	[138, "PayloadList", RAW_DECODER],
	[139, "ActivePayloads", UINT8_DECODER],
	[140, "WeaponsStores", RAW_DECODER],
	[141, "WaypointList", RAW_DECODER]
];

const toDisplayName = (name: string): string =>
	name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.trim();

const toCamelCase = (name: string): string =>
	name.charAt(0).toLowerCase() + name.slice(1);

export const MISB_0601_TAGS = new Map<number, Misb0601Definition>(
	TAG_ENTRIES.map(([id, name, decoder]) => [
		id,
		{
			id,
			name: toCamelCase(name),
			displayName: toDisplayName(name),
			decoder: decoder ?? RAW_DECODER
		}
	])
);

export const MIS_0601_TAG_IDS = TAG_ENTRIES.map(([id]) => id);

export function getMisb0601Definition(tag: number): Misb0601Definition | undefined {
	return MISB_0601_TAGS.get(tag);
}


