export interface ICoordinates {
    latitude: number;
    longitude: number;
}

export interface IDevice {
    id: string;
    modelDisplayName: string;
    location: ICoordinates;
}

export interface ISimpleDevice {
    id: string;
    name: string;
    coordinates: ICoordinates;
}

export enum UnitType {
    SI = "si",
    US = "us",
}

export interface IWeatherDay {
    high: number;
    low: number;
    icon: string;
}

export interface IWeatherResponse {
    currently: number;
    daily: IWeatherDay[];
}

export interface IDarkSkyDay {
    temperatureHigh: number;
    temperatureLow: number;
    icon: string;
}

export interface IWeatherState extends IWeatherResponse {
    lastUpdated: Date;
}

export interface ITimezoneResponse {
    timeZoneId: string;
}

export interface ILocationResponse {
    location: string;
}