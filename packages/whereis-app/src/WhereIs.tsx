import { flex, flex1, horizontal, vertical } from "csstips/lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { StaticMap } from "react-map-gl";
import { style } from "typestyle";
import { ICombinedDevice } from "whereis-common";

import { getBestDevice, MAPBOX_TOKEN, fetchData } from "./util";

interface IWhereIsState {
  device: ICombinedDevice;
}

export default class WhereIs extends React.Component<{}, IWhereIsState> {
  public state: IWhereIsState = {
    device: undefined
  };

  private container: HTMLDivElement;
  private refHandler = {
    container: (container: HTMLDivElement) => {
      this.container = container;
    }
  };

  public componentWillMount() {
    fetchData().then((devices: ICombinedDevice[]) => {
      const device = getBestDevice(devices);
      this.setState({ device });
    });
  }

  public render() {
    const { device } = this.state;

    return device != null ? (
      <div className={Styles.container}>
        <div className={Styles.location}>{device.city}</div>
        {this.maybeRenderMap()}
        <div className={Styles.footer}>
          {this.maybeRenderWeather()}
          {this.maybeRenderTimezone()}
        </div>
      </div>
    ) : (
      <div className="loader" />
    );
  }

  private maybeRenderMap = () => {
    const { device } = this.state;
    if (!device) {
      return undefined;
    }

    const { latitude, longitude } = device.coordinates;
    console.log(this.container && this.container.scrollHeight);
    return (
      <div className={Styles.map} ref={this.refHandler.container}>
        <StaticMap
          width="100%"
          height="100%"
          latitude={latitude}
          longitude={longitude}
          zoom={8}
          mapStyle="mapbox://styles/yourarm/cizgnx6xj008q2roia5fiwne7"
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </div>
    );
  };

  private maybeRenderWeather = () => {
    const { device } = this.state;
    if (!device) {
      return undefined;
    }

    return (
      <div className={Styles.weather}>
        <div className={Styles.weatherNow}>
          {Math.round(device.weather.currently)}&deg;
        </div>
        <div>Currently</div>
      </div>
    );
  };

  private maybeRenderTimezone = () => {
    const { device } = this.state;
    if (!device) {
      return null;
    }

    const time = moment().tz(device.timezone);
    return (
      <div className={Styles.datetime}>
        <div className={Styles.time}>{time.format("h:mm A")}</div>
        <div className={Styles.date}>{time.format("dddd D MMMM YYYY")}</div>
      </div>
    );
  };
}

namespace Styles {
  const textLarge = 70;
  const textMedium = 30;
  const textSmall = 12;

  const edgePadding = "25px 90px";

  export const wrapper = style(
    {
      display: "flex"
    },
    flex1
  );

  export const container = style(
    {
      display: "flex",
      width: "100%"
    },
    vertical
  );

  export const location = style({
    fontSize: textLarge,
    padding: edgePadding,
    textAlign: "right"
  });

  export const map = style(
    {
      border: "10px solid #dedede",
      margin: "0 auto",
      width: "calc(100% - 180px)"
    },
    flex1
  );

  export const footer = style(horizontal);

  export const weather = style({
    fontSize: textSmall,
    padding: edgePadding
  });

  export const weatherNow = style({
    fontSize: textMedium,
    margin: "10px 0"
  });

  export const weatherCurrently = style({
    fontSize: textSmall
  });

  export const datetime = style({
    marginLeft: "auto",
    padding: edgePadding,
    textAlign: "right"
  });

  export const time = style({
    fontSize: textMedium,
    margin: "10px 0"
  });

  export const date = style({
    fontSize: textSmall,
    margin: "10px 0"
  });
}
