/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import moment from "moment";
import "chartjs-adapter-moment"

function Graph({ caseType, ...props }) {
  const [data, setData] = useState({});

  const options = {
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor:
          caseType === "deaths"
            ? "red"
            : caseType === "recovered"
            ? "green"
            : "red",

        mode: "index",
        intersect: false,

        callbacks: {
          title: function (tooltipItem, data) {
            return moment(tooltipItem[0].raw.x).format(" Do,MMM,YYYY ");
          },
          label: function (tooltipItem, data) {
            return caseType + ": " + numeral(tooltipItem.raw.y).format("0a");
          },
        },
      },
    },

    scales: {
      x: 
        {
          type: "time",
          time: {
            formt: "MM/DD/YY",
          },
        },
 
      yAxes: {
        ticks: {
          callback: function (val, index) {
            return numeral(val).format("0a");
          },
          gridLines: {
            display: false,
          },
        },
      },
    },
  };
  const buildChartData = (data, caseType) => {
    const ChartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };
        ChartData.push(newDataPoint);
      }
      lastDataPoint = data[caseType][date];
    }
    return ChartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, caseType);
          setData(chartData);
        });
    };
    fetchData();
  }, [caseType]);

  return (
    <>
      {data?.length > 0 && (
        <Line
          height="230vh"
          options={options}
          data={{
            datasets: [
              {
                data: data,
                fill: true,
                backgroundColor:
                  caseType === "recovered"
                    ? "#90EE90"
                    : "rgba(204, 16, 52, 0.5)",
                borderColor:
                  caseType === "recovered" ? "green" : "rgba(204, 16, 52, 0.5)",
              },
            ],
          }}
        />
      )}
    </>
  );
}

export default Graph;
