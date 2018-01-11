import {
  ITimezoneResponse,
  ISimpleDevice,
  IWeatherResponse,
  ICoordinates,
  UnitType
} from "../../common/types";

export const BACKEND_URL = process.env.NODE_ENV === "production"
  ? "https://whereis.dynamic.jcaw.me"
  : "http://127.0.0.1:5000";

export const fetchDevices = () => {
  return fetch(BACKEND_URL + "/devices").then(resp => resp.json());
};

export const fetchLocation = ({ latitude, longitude }: ICoordinates) => {
  return fetch(
    BACKEND_URL + `/location?latitude=${latitude}&longitude=${longitude}`
  ).then(resp => resp.json());
};

export const fetchTimezone = ({ latitude, longitude }: ICoordinates) => {
  return fetch(
    BACKEND_URL + `/timezone?latitude=${latitude}&longitude=${longitude}`
  ).then(resp => resp.json());
};

export const fetchWeather = (
  { latitude, longitude }: ICoordinates,
  units: UnitType
) => {
  return fetch(
    BACKEND_URL + `/weather?latitude=${latitude}&longitude=${longitude}&units=${units}`
  ).then(resp => resp.json());
};
