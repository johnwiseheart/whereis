import * as classNames from "classnames";
import * as moment from "moment-timezone";
import * as React from "react";
import { connect } from "react-redux";
import "whatwg-fetch";
import "./WhereIs.scss";
import { getBestDevice } from "../util";
import { Loader, LocationPanel, Map, TimePanel, WeatherPanel } from ".";
import {
  ISimpleDevice,
  ICoordinates,
  IWeatherState,
  IWeatherResponse,
  UnitType,
  ITimezoneResponse,
  ILocationResponse
} from "../../../common/types";
import {
  fetchDevices,
  fetchWeather,
  fetchTimezone,
  fetchLocation
} from "../api";

interface IWhereIsState {
  location: string;
  coordinates: ICoordinates;
  weather: IWeatherState;
  timezone: string;
  seconds: number;
}

export default class WhereIs extends React.Component<{}, IWhereIsState> {
  private container: HTMLDivElement;
  private refHandler = {
    container: (container: HTMLDivElement) => {
      this.container = container;
    }
  };

  public state: IWhereIsState = {
    location: "",
    coordinates: undefined,
    weather: undefined,
    timezone: "",
    seconds: 0
  };

  public componentWillMount() {
    fetchDevices().then((devices: ISimpleDevice[]) => {
      const device = getBestDevice(devices);
      this.setState({ coordinates: device.coordinates });
      fetchLocation(device.coordinates).then((resp: ILocationResponse) => {
        this.setState({ location: resp.location });
      });
      fetchTimezone(device.coordinates).then((resp: ITimezoneResponse) => {
        this.setState({ timezone: resp.timeZoneId });
        setInterval(() => {
          this.setState({ seconds: this.state.seconds + 1 });
        }, 1000);
      });
      fetchWeather(device.coordinates, UnitType.SI).then(
        (resp: IWeatherResponse) => {
          this.setState({ weather: { ...resp, lastUpdated: new Date() } });
        }
      );
    });
  }

  public render() {
    const { coordinates, location, seconds, timezone, weather } = this.state;
    const maybeRenderMap = coordinates ? (
      <Map
        coordinates={coordinates}
        height={this.container.offsetHeight}
        width={this.container.offsetWidth}
      />
    ) : (
      <div className="loader-center">
        <Loader />
      </div>
    );

    return (
      <div ref={this.refHandler.container}>
        {maybeRenderMap}
        <div className="container">
          <div className="panel">
            <LocationPanel location={location} />
          </div>
          <div className="footer panel">
            <TimePanel seconds={seconds} timezone={timezone} />
            <WeatherPanel weather={weather} />
          </div>
        </div>
      </div>
    );
  }
}
