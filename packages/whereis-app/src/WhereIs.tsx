import { flex, flex1, horizontal, vertical } from "csstips/lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { StaticMap } from "react-map-gl";
import { style } from "typestyle";
import {
  ICoordinates,
  ILocationResponse,
  ISimpleDevice,
  ITimezoneResponse,
  IWeatherResponse,
  IWeatherState,
  UnitType,
} from "whereis-common";
import {
  fetchDevices,
  fetchLocation,
  fetchTimezone,
  fetchWeather,
} from "./api";
import { getBestDevice, MAPBOX_TOKEN } from "./util";

interface IWhereIsState {
  location: string;
  coordinates: ICoordinates;
  weather: IWeatherState;
  timezone: string;
  seconds: number;
}

export default class WhereIs extends React.Component<{}, IWhereIsState> {
  public state: IWhereIsState = {
    coordinates: undefined,
    location: "",
    seconds: 0,
    timezone: "",
    weather: undefined,
  };

  private container: HTMLDivElement;
  private mapContainer: HTMLDivElement;
  private refHandler = {
    container: (container: HTMLDivElement) => {
      this.container = container;
    },
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
        },
      );
    });
  }

  public render() {
    const { location, seconds, timezone, weather } = this.state;

    const maybeRender = this.hasFinishedLoading() ? (
      <div className={Styles.container}>
        <div className={Styles.location}>{location}</div>
        {this.maybeRenderMap()}
        <div className={Styles.footer}>
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
      location !== undefined &&
      timezone !== undefined &&
      weather !== undefined
    );
  }

  private maybeRenderMap = () => {
    const { coordinates, location, seconds, timezone, weather } = this.state;
    if (!coordinates) {
      return undefined;
    }

    return (
      <div className={Styles.map}>
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
  }

  private maybeRenderWeather = () => {
    const { weather } = this.state;
    if (!weather) {
      return undefined;
    }

    return (
      <div className={Styles.weather}>
        <div className={Styles.weatherNow}>
          {Math.round(weather.currently)}&deg;
        </div>
        <div>Currently</div>
      </div>
    );
  }

  private maybeRenderTimezone = () => {
    const { timezone } = this.state;
    if (!timezone) {
      return null;
    }

    const time = moment().tz(timezone);
    return (
      <div className={Styles.datetime}>
        <div className={Styles.time}>{time.format("h:mm A")}</div>
        <div className={Styles.date}>{time.format("dddd D MMMM YYYY")}</div>
      </div>
    );
  }
}

namespace Styles {
  const textLarge = 70;
  const textMedium = 30;
  const textSmall = 12;

  const edgePadding = "25px 90px";

  export const container = style(
    {
      height: "100vh",
    },
    vertical,
  );

  export const location = style({
    fontSize: textLarge,
    padding: edgePadding,
    textAlign: "right",
  });

  export const map = style(
    {
      border: "10px solid #dedede",
      margin: "0 auto",
      overflow: "hidden",
    },
    flex1,
  );

  export const footer = style(horizontal);

  export const weather = style({
    fontSize: textSmall,
    padding: edgePadding,
  });

  export const weatherNow = style({
    fontSize: textMedium,
    margin: "10px 0",
  });

  export const weatherCurrently = style({
    fontSize: textSmall,
  });

  export const datetime = style({
    marginLeft: "auto",
    padding: edgePadding,
    textAlign: "right",
  });

  export const time = style({
    fontSize: textMedium,
    margin: "10px 0",
  });

  export const date = style({
    fontSize: textSmall,
    margin: "10px 0",
  });
}
