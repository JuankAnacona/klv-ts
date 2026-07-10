import { KlvPacket } from "../../packet/KlvPacket";

export class Misb0601Metadata {

    constructor(
        readonly packet: KlvPacket
    ) {}

    [key: string]: unknown;

    missionId?: string;

    precisionTimestamp?: bigint;

    platformHeadingAngle?: number;

    sensorLatitude?: number;

    sensorLongitude?: number;

    sensorTrueAltitude?: number;

    sensorHorizontalFov?: number;

    sensorVerticalFov?: number;

    sensorRelativeAzimuthAngle?: number;

    sensorRelativeElevationAngle?: number;

    sensorRelativeRollAngle?: number;

    slantRange?: number;

    targetWidth?: number;

    targetLocationLatitude?: number;

    targetLocationLongitude?: number;

    targetLocationElevation?: number;

    targetTrackGateWidth?: number;

    targetTrackGateHeight?: number;

    targetErrorEstimateCE90?: number;

    targetErrorEstimateLE90?: number;


}
