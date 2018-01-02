import { ICoordinates, ISimpleDevice, UnitType } from "../../common/types";

export const getBestDevice = (devices: ISimpleDevice[]) => {
  const order = ["iPhone", "MacBook Pro", "iPad"];

  return devices.sort((a, b) => {
    if (order.indexOf(a.name) > order.indexOf(b.name)) {
      return 1;
    }
    if (order.indexOf(a.name) < order.indexOf(b.name)) {
      return -1;
    }
    return 0;
  })[0];
};

export const MAPBOX_TOKEN =
  "pk.eyJ1IjoieW91cmFybSIsImEiOiJjamFoNWM3bXQxbHBuMzJvaTMydTJ3ODI3In0.XCIuLDNhGrDpAlKIQRMYjg";
