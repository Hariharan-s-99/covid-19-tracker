import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Maps from "./Map";
import Table from "./Table";
import { sortData, printPretty } from "./HelperFunctions";
import Graph from "./Graph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({}); //individual country
  const [tableData, setTableData] = useState([]);

  const [caseType, setCaseType] = useState("cases");
  
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
 
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // united kingdom
            value: country.countryInfo.iso2, //uk
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const countryData = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "WorldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);

        setMapCenter(
          countryCode === "WorldWide"
            ? { lat: 34.80746, lng: -40.4796 }
            : [data.countryInfo.lat, data.countryInfo.long]
        );

        setMapZoom(countryCode === "WorldWide" ? 3 : 4);
      });
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19-TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={countryData}>
              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            today={printPretty(countryInfo.todayCases)}
            total={printPretty(countryInfo.cases)}
          />
          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            today={printPretty(countryInfo.todayRecovered)}
            total={printPretty(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            today={printPretty(countryInfo.todayDeaths)}
            total={printPretty(countryInfo.deaths)}
          />
        </div>
        <Maps
          key={country.value}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          caseType={caseType}
        />
      </div>
      <div className="app__right">
        <Card className="app__right__top">
          <CardContent>
            <h3 className="app__right__h3"> Total Cases By Country</h3>
            <Table countries={tableData} />
          </CardContent>
        </Card>

        <Card className="app__right__bottom">
          <CardContent>
            <h3 className="app__right__h3">
              WorldWide Coronavirus {caseType} History
            </h3>
            <Graph caseType={caseType}  />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
