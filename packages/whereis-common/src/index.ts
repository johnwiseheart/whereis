export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IDevice {
  id: string;
  modelDisplayName: string;
  location: ICoordinates;
}

export interface ICombinedDevice {
  coordinates: ICoordinates;
  name: string;
  timezone: string;
  city: string;
  weather: IWeatherResponse;
}

export interface IWeatherDay {
  high: number;
  low: number;
  icon: string;
}

export interface IWeatherResponse {
  currently: number;
  summary: string;
  daily: IWeatherDay[];
}

export interface IDarkSkyDay {
  temperatureHigh: number;
  temperatureLow: number;
  icon: string;
}
