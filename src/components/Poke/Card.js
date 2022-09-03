import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { getPokemonImage } from "../../services/utils/getPokemonImage";
import pokeapi from "../../services/api/pokeapi";
import Info from "./Info";
import "./styles.css";

const Card = ({ name, id, history }) => {
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [showModalError, setShowModalError] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    function LoadPokemon() {
      pokeapi
        .get(`/pokemon/${name}`)
        .then((response) => {
          if (response.status == 200) {
            LoadSpecies(response.data);
          }
        })
        .catch((error) => {
          setShowModalError(true);
        });
    }

    if (name == undefined) history.push({ pathname: "/" });
    window.scrollTo(0, 0);
    LoadPokemon();
  }, [window.location.pathname]);

  async function LoadSpecies(poke) {
    try {
      let pokemonSpecies = await pokeapi.get(`/pokemon-species/${name}`);
      var abilities = "";
      poke.abilities.map((item, index) => {
        abilities += `${item.ability.name}${poke.abilities.length == index + 1 ? "" : ", "
          }`;
      });

      var obj = {
        id: poke.id,
        name: poke.name,
        height: poke.height,
        weight: poke.weight,
        abilities,
        capture_rate: pokemonSpecies.data.capture_rate,
        habitat: pokemonSpecies.data.habitat?.name,
      };

      setDetails(obj);
      setLoading(false);
    } catch (error) {
      setShowModalError(true);
    }
  }

  return (
    <div className="container-card mb-4">
      <div>
        <div className="text-center">
          <h2 className="pokemon-name limit-text my-0">{name}</h2>
          <p className="pokemon-number mb-0">
            # {id.toString().padStart(3, "0")}
          </p>
        </div>
      </div>
      <img alt={name} title={name} src={getPokemonImage(id)} />
      <Button variant="danger" onClick={handleShow}> Ver más</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Información de {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={6}>
              <Card
                name={details.name}
                id={details.id}
              />
            </Col>
            <Col xs={12} md={6}>
              <Info
                height={details.height}
                capture_rate={details.capture_rate}
                weight={details.weight}
                abilities={details.abilities}
                habitat={details.habitat}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Card;