// import react from "react";
import { Popup, Circle } from "react-leaflet";
import numeral from "numeral";
import "./Map.css";

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const printPretty = (stat) =>
  stat ? numeral(stat).format("0.0a") : "0";

const casesTypeColors = {
  cases: {
    option: { color: "#cc1034", fillColor: "#cc1034" },
    multiplier: 200,
  },
  recovered: {
    option: { color: "	#008000", fillColor: "#7dd71d" },
    multiplier: 200,
  },
  deaths: {
    option: { color: "red", fillColor: "#ff6c47" },
    multiplier: 1100,
  },
};

export const showDataOnMap = (data, caseType, center) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      opacity={0.4}
      pathOptions={casesTypeColors[caseType].option}
      radius={
        Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
      }
    >

      <Popup>
        <div className="info__cointainer">
          <div
            className="info__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info__name">{country.country}</div>
          <div className="info__Cases">
            <span className="red">Cases: </span>{" "}
            {numeral(country.cases).format("0,0")}{" "}
          </div>
          <div className="info__recovered">
            <span className="green">Recovered: </span>{" "}
            {numeral(country.recovered).format("0,0")}{" "}
          </div>
          <div className="info__deaths">
            <span className="red">Deaths: </span>{" "}
            {numeral(country.deaths).format("0,0")}{" "}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
