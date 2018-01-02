import * as moment from "moment-timezone";
import * as React from "react";
import { Loader } from "./Loader";

interface ITimePanelProps {
  seconds: number;
  timezone: string;
}

export const TimePanel: React.SFC<ITimePanelProps> = ({ timezone }) => {
  if (!timezone) {
    return <Loader />;
  }

  const time = moment().tz(timezone);
  return (
    <div className="footer-child datetime">
      <div>
        <div className="time">{time && time.format("h:mm:ss A")}</div>
        <div className="date">{time && time.format("dddd D MMMM YYYY")}</div>
      </div>
    </div>
  );
};
