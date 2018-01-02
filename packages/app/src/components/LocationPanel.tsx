import * as React from "react";
import { Loader } from ".";

interface ILocationPanelProps {
  location: string;
}

export const LocationPanel: React.SFC<ILocationPanelProps> = ({ location }) => {
  if (!location) {
    return <Loader />;
  }

  return (
    <div>
      <div className="subtext">John's in</div>
      <h1>{location}</h1>
    </div>
  );
};
