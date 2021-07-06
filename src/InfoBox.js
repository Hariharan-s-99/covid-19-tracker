import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";
function InfoBox({ title, isRed, today, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`info ${active && isRed ? "info--red" : null} ${
        active && !isRed ? "info--green" : null
      } `}
    >
      <CardContent>
        <Typography className="info__title" color="textSecondary" >
          {title}
        </Typography>

        <Typography className="info__total" color="textSecondary">
          <span className={`infoBox__cases ${!isRed && "info--cases--green"}`}>
            {today}{" "}
          </span>
          Today
        </Typography>
        <Typography className="info__total" color="textSecondary">
          <span className={`infoBox__cases ${!isRed && "info--cases--green"}`}>
            {total}{" "}
          </span>
           Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
