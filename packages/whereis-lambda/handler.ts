import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import axios from "axios";
import * as https from "https";
import * as tzlookup from "tz-lookup";
import {
  ICoordinates,
  IDevice,
  IDarkSkyDay,
  ICombinedDevice
} from "whereis-common";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const APPLE_USERNAME = process.env.WHEREIS_USERNAME;
const APPLE_PASSWORD = process.env.WHEREIS_PASSWORD;
const DARKSKY_KEY = process.env.WHEREIS_DARKSKY_KEY;

const APPLE_AUTH_HEADER =
  "Basic " +
  new Buffer(APPLE_USERNAME + ":" + APPLE_PASSWORD).toString("base64");

const DEVICE_API_URL = `https://fmipmobile.icloud.com/fmipservice/device/${APPLE_USERNAME}/initClient`;

const getGeocodeApi = ({ latitude, longitude }: ICoordinates) =>
  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

const getDarkskyApi = ({ latitude, longitude }: ICoordinates) =>
  `https://api.darksky.net/forecast/${DARKSKY_KEY}/${latitude},${longitude}?units=si`;

const getCity = async (coordinates: ICoordinates) => {
  const resp = await axios.get(getGeocodeApi(coordinates));
  return resp.data.address.city;
};

const getWeather = async (coordinates: ICoordinates) => {
  const { data } = await axios.get(getDarkskyApi(coordinates), {
    httpsAgent
  });
  if (data != null) {
    const { currently, daily } = data;
    return {
      currently: currently.temperature,
      daily: daily.data
        .map(({ temperatureLow, icon, temperatureHigh }: IDarkSkyDay) => ({
          high: temperatureHigh,
          icon: icon,
          low: temperatureLow
        }))
        .slice(0, 3)
    };
  }
};

const getCombinedDevice = async ({
  location,
  modelDisplayName
}: IDevice): Promise<ICombinedDevice> => {
  const { latitude, longitude } = location;

  const [city, weather] = await Promise.all([
    getCity(location),
    getWeather(location)
  ]);

  return {
    coordinates: {
      latitude: Math.round(latitude * 10) / 10,
      longitude: Math.round(longitude * 10) / 10
    },
    name: modelDisplayName,
    timezone: tzlookup(latitude, longitude),
    city,
    weather
  };
};

const getDeviceData = async () => {
  const { data } = await axios.post<{ content: IDevice[] }>(
    DEVICE_API_URL,
    undefined,
    {
      headers: {
        Authorization: APPLE_AUTH_HEADER
      },
      httpsAgent
    }
  );

  return Promise.all(
    data.content
      .filter(device => device.location != null)
      .map(getCombinedDevice)
  );
};

export const getLocationInfo: APIGatewayProxyHandler = async () => {
  const devices = await getDeviceData();
  return {
    statusCode: 200,
    body: JSON.stringify(devices),
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
};
