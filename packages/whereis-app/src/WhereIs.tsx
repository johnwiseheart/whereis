import * as classNames from "classnames";
import * as moment from "moment-timezone";
import * as React from "react";
import { connect } from "react-redux";
import "whatwg-fetch";
import "./WhereIs.scss";
import { getBestDevice, MAPBOX_TOKEN } from "./util";
import {
  ISimpleDevice,
  ICoordinates,
  IWeatherState,
  IWeatherResponse,
  UnitType,
  ITimezoneResponse,
  ILocationResponse
} from "whereis-common";
import {
  fetchDevices,
  fetchWeather,
  fetchTimezone,
  fetchLocation
} from "./api";
import { StaticMap } from "react-map-gl";

interface IWhereIsState {
  location: string;
  coordinates: ICoordinates;
  weather: IWeatherState;
  timezone: string;
  seconds: number;
}

export default class WhereIs extends React.Component<{}, IWhereIsState> {
  private container: HTMLDivElement;
  private mapContainer: HTMLDivElement;
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
    const { location, seconds, timezone, weather } = this.state;

    const maybeRender = this.hasFinishedLoading() ? (
      <div className="whereis">
        <div className="location">{location}</div>
        {this.maybeRenderMap()}
        <div className="footer">
          {this.maybeRenderWeather()}
          {this.maybeRenderTimezone()}
        </div>
      </div>
    ) : (
      <div className="loader" />
    );

    return (
      <div className="whereis-wrapper" ref={this.refHandler.container}>
        {maybeRender}
      </div>
    );
  }

  private hasFinishedLoading = () => {
    const { coordinates, location, seconds, timezone, weather } = this.state;
    return (
      coordinates !== undefined &&
      location != undefined &&
      timezone !== undefined &&
      weather !== undefined
    );
  };

  private maybeRenderMap = () => {
    const { coordinates, location, seconds, timezone, weather } = this.state;
    if (!coordinates) {
      return undefined;
    }

    return (
      <div className="map">
        <StaticMap
          width={this.container.offsetWidth - 200}
          height={this.container.offsetHeight}
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          zoom={8}
          mapStyle="mapbox://styles/yourarm/cizgnx6xj008q2roia5fiwne7"
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </div>
    );
  };

  private maybeRenderWeather = () => {
    const { weather } = this.state;
    if (!weather) {
      return undefined;
    }

    return (
      <div className="weather">
        <div className="now">{Math.round(weather.currently)}&deg;</div>
        <div>Currently</div>
      </div>
    );
  };

  private maybeRenderTimezone = () => {
    const { timezone } = this.state;
    if (!timezone) {
      return null;
    }

    const time = moment().tz(timezone);
    return (
      <div className="datetime">
        <div className="time">{time.format("h:mm A")}</div>
        <div className="date">{time.format("dddd D MMMM YYYY")}</div>
      </div>
    );
  };
}
