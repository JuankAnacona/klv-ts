import { KlvParseError } from "../../errors/KlvParseError";
import { DecoderFunction, Misb0601Definition } from "./Misb0601Definition";

import {
	RAW_DECODER,
	STRING_DECODER,
	UINT16_DECODER,
	UINT64_DECODER,
	PLATFORM_HEADING_DECODER,
	LATITUDE_DECODER,
	LONGITUDE_DECODER
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

	[6, "PlatformPitchAngle"],

	[7, "PlatformRollAngle"],

	[8, "PlatformTrueAirspeed"],

	[9, "PlatformIndicatedAirspeed"],

	[10, "PlatformDesignation", STRING_DECODER],

	[11, "ImageSourceSensor", STRING_DECODER],

	[12, "ImageCoordinateSystem", STRING_DECODER],

	[13, "SensorLatitude", LATITUDE_DECODER],

	[14, "SensorLongitude", LONGITUDE_DECODER],

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


