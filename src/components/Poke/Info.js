import React from "react";
import { Form } from "react-bootstrap";
import "./styles.css";

const Info = ({
  height,
  capture_rate,
  weight,
  abilities,
  habitat,
}) => {
  return (
    <>
      <div className="container-search mb-4">
        <Form.Label>Características del Pokemon</Form.Label>
      </div>
      <div className="container-info d-flex flex-wrap my-4">
        <div className="info-item">
          <h4>Altura</h4>
          <p>{Math.round(height * 10) / 100} m</p>
        </div>

        <div className="info-item">
          <h4>Porcentaje de captura</h4>
          <p>{Math.round(capture_rate * 100) / 100}%</p>
        </div>

        <div className="info-item">
          <h4>Peso</h4>
          <p>{Math.round(weight * 10) / 100} kg</p>
        </div>

        <div className="info-item">
          <h4>Habilidades</h4>
          <p>{abilities != null ? abilities : "-"}</p>
        </div>

        <div className="info-item mb-0">
          <h4>Hábitat</h4>
          <p>{habitat != null ? habitat : "-"}</p>
        </div>
      </div></>
  );
};

export default Info;
