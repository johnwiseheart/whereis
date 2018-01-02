import * as moment from "moment";
import * as React from "react";
import { IWeatherDay, IWeatherState } from "../../../common/types";
import { Loader } from "./Loader";

interface IWeatherPanelProps {
  weather: IWeatherState;
}

interface IWeatherTemperatureRender {
  heading: string;
  content: number;
}

const getTwoDaysFromNowName = () => {
  return moment()
    .add(2, "days")
    .format("dddd");
};

const renderWeatherTemperature = (
  weatherTemp: IWeatherTemperatureRender,
  key: string
) => (
  <div className="temperature" key={key}>
    <div className="temperature-content">{weatherTemp.content}</div>
    <div className="temperature-heading">{weatherTemp.heading}</div>
  </div>
);

const renderWeatherDay = (
  day: IWeatherDay,
  index: number,
  weatherTitles: string[],
  currently: number
) => {
  const temperatures = [
    index === 0 && { heading: "Now", content: Math.round(currently) },
    { heading: "Low", content: Math.round(day.low) },
    { heading: "High", content: Math.round(day.high) }
  ].filter(subItem => subItem);

  const renderTemperatures = temperatures.map(
    (temperature: IWeatherTemperatureRender) => {
      const key = weatherTitles[index] + temperature.heading;
      return renderWeatherTemperature(temperature, key);
    }
  );

  return (
    <div className="weather-day" key={weatherTitles[index]}>
      <div className="heading">{weatherTitles[index]}</div>
      <div className="content">{renderTemperatures}</div>
    </div>
  );
};

export const WeatherPanel: React.SFC<IWeatherPanelProps> = ({ weather }) => {
  if (!weather) {
    return <Loader />;
  }

  const weatherTitles = ["Today", "Tomorrow", getTwoDaysFromNowName()];
  const weatherItems = weather.daily.map((day: IWeatherDay, index: number) => {
    return renderWeatherDay(day, index, weatherTitles, weather.currently);
  });

  return <div className="footer-child weather">{weatherItems}</div>;
};
