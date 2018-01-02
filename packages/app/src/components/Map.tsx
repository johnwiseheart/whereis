import * as React from "react";
import { StaticMap } from "react-map-gl";
import { MAPBOX_TOKEN } from "../util";
import { Loader } from "./Loader";
import { ICoordinates } from "../../../common/types";

interface IMapProps {
  coordinates: ICoordinates;
  height: number;
  width: number;
}

export const Map: React.SFC<IMapProps> = ({
  coordinates: { latitude, longitude },
  height,
  width
}) => {
  return (
    <div className="map">
      <StaticMap
        width={width}
        height={height}
        latitude={latitude}
        longitude={longitude}
        zoom={8}
        mapStyle="mapbox://styles/yourarm/cizgnx6xj008q2roia5fiwne7"
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
    </div>
  );
};
