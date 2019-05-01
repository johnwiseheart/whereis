import React from "react";
import styles from "./App.module.scss";
import { StaticMap } from "react-map-gl";
import { ICombinedDevice } from "whereis-common";

export const MAPBOX_TOKEN =
  "pk.eyJ1IjoieW91cmFybSIsImEiOiJjamFoNWM3bXQxbHBuMzJvaTMydTJ3ODI3In0.XCIuLDNhGrDpAlKIQRMYjg";

export const BACKEND_URL = "https://serverless.jcaw.me/whereis/getLocationInfo";

export const fetchData = async () => {};

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

interface IAppState {
  device: ICombinedDevice | undefined;
}

class App extends React.PureComponent<{}, IAppState> {
  public state: IAppState = {
    device: undefined
  };

  componentWillMount() {
    fetch(BACKEND_URL)
      .then(resp => resp.json())
      .then(devices => getBestDevice(devices))
      .then(device => this.setState({ device }));
  }

  render() {
    const { device } = this.state;

    if (device === undefined) {
      return null;
    }

    const overlay = device !== undefined ? <Overlay {...device} /> : null;

    const { latitude, longitude } = device.coordinates;
    return (
      <>
        {overlay}
        <StaticMap
          width="100%"
          height="100%"
          latitude={latitude}
          longitude={longitude}
          zoom={9}
          mapStyle="mapbox://styles/yourarm/cizgnx6xj008q2roia5fiwne7"
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </>
    );
  }
}

const Overlay: React.SFC<ICombinedDevice> = ({ timezone, city, weather }) => {
  const timeString = new Date().toLocaleString("en-US", {
    timeZone: timezone
  });
  const time = new Date(timeString);

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <header>{city}</header>
        <div className={styles.separator} />
        <main>
          <div>
            <div>Local time</div>
            <div>
              {time.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit"
              })}{" "}
            </div>
            <div>
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
          <div>
            <div>Weather</div>
            <div>{Math.round(weather.currently)}&deg;</div>
            <div>{weather.summary}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
