import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Header from "../../layouts/Header/Header";
import Card from "../../components/Poke/Card";
import pokeapi from "../../services/api/pokeapi";
import Search from "../../components/Search/Search";
import { RescuePokemons } from "../../services/utils/rescuePoke";
import { CheckPokemons } from "../../services/utils/checkPoke";
import "./styles.css";

const limit = 100; 
let arrayPokemons = [];
let maximum = 0;

function Home({ history, ...props }) {
  const { query } = props.match.params;

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);

  const ShowResult = useCallback((maxamountpokemons, pokemons) => {
    maximum = maxamountpokemons;
    setPokemons(pokemons);
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      if (!query) {
        setLoading(false);
        return;
      }

      history.push(`/${query}`);
      const filterPokemons = arrayPokemons.filter((item) => 
        item.name.includes(query.toLowerCase()) || item.number.includes(query)
      );

      ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
      setLoading(false);
    };

    fetchPokemons();
  }, [query, ShowResult, history]);

  useEffect(() => {
    const initializePokemons = async () => {
      setLoading(true);
      const listLocalStorage = CheckPokemons();
      if (!listLocalStorage) {
        await LoadPokemons();
        return;
      }
      arrayPokemons = listLocalStorage;
      if (query) {
        const filterPokemons = listLocalStorage.filter(
          (i) => i.name.includes(query.toLowerCase()) || i.number.includes(query)
        );
        ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
      } else {
        ShowResult(listLocalStorage.length, listLocalStorage.slice(0, 1));
      }
      setLoading(false);
    };

    initializePokemons();
  }, [query, ShowResult]);

  const LoadPokemons = async () => {
    let pokemonsLs = await pokeapi.get(`/pokemon?limit=${limit}`);
    let allPokemons = await Promise.all(
      pokemonsLs.data.results.map(async (pokemon) => {
        let PokemonsFeatures = await pokeapi.get(`/pokemon/${pokemon.name}`);
        return {
          name: PokemonsFeatures.data.name,
          id: PokemonsFeatures.data.id,
          number: PokemonsFeatures.data.id.toString().padStart(3, "0"),
          image:
            PokemonsFeatures.data.sprites.versions["generation-v"]["black-white"]
              .animated.front_default,
        };
      })
    );

    RescuePokemons(allPokemons);
    arrayPokemons = allPokemons;
    ShowResult(allPokemons.length, allPokemons.slice(0, 1));
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <Container fluid>
        <Search history={history} query={query} />
        {loading ? (
          <div className="d-flex justify-content-center">
            <Button variant="danger" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Estamos cargando todos los pokemones para una mejor experiencia en la búsqueda (Actualmente hay {limit} pokemones disponibles).
            </Button>
          </div>
        ) : (
          <div className="box">
            <div>
              <Row>
                {pokemons.map((item) => (
                  <Col key={item.id} xs={12} sm={6} lg={3}>
                    <Card name={item.name} id={item.id} />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
