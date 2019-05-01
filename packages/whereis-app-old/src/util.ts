import { ICombinedDevice } from "whereis-common";

export const getBestDevice = (devices: ICombinedDevice[]) => {
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

export const BACKEND_URL = "https://serverless.jcaw.me/whereis/getLocationInfo";

export const fetchData = () => {
  return fetch(BACKEND_URL).then(resp => resp.json());
};
