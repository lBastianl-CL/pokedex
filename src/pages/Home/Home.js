import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Header from "../../layouts/Header/Header";
import Card from "../../components/Poke/Card";
import pokeapi from "../../services/api/pokeapi";
import Search from "../../components/Search/Search";
import { RescuePokemons } from "../../services/utils/rescuePoke";
import { CheckPokemons } from "../../services/utils/checkPoke";
import "./styles.css";

const arrayPokemons = [];
const limit = 100; // 898 2022/09/01
let maxamountpokemons = 0;
let maximum = 0;

function Home({ history, ...props }) {
  const { query } = props.match.params;

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);

  function ShowResult(maxamountpokemons, pokemons) {
    maxamountpokemons = maximum;
    setPokemons(pokemons);
  }

  useEffect(() => {
    setLoading(true);
    if (query === undefined) {
      setLoading(false);
      return;
    }

    history.push(`/${query}`);
    const filterPokemons = arrayPokemons.filter((item) => {
      return (
        item.name.includes(query.toLowerCase()) || item.number.includes(query)
      );
    });

    ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
    setLoading(false);
  }, [query, history]);

  useEffect(() => {
    setLoading(true);
    const listLocalStorage = CheckPokemons();
    if (listLocalStorage === null) {
      LoadPokemons();
      return;
    }
    arrayPokemons = listLocalStorage;
    if (query !== undefined) {
      const filterPokemons = listLocalStorage.filter(
        (i) => i.name.includes(query.toLowerCase()) || i.number.includes(query)
      );

      ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
    } else {
      ShowResult(listLocalStorage.length, listLocalStorage.slice(0, 1));
    }
    setLoading(false);
  }, [query]);

  async function LoadPokemons() {
    const pokemonsLs = await pokeapi.get(`/pokemon?limit=${limit}`);
    const allPokemons = [];
    for (let i = 0; i < pokemonsLs.data.results.length; i++) {
      const PokemonsFeatures = await pokeapi.get(
        `/pokemon/${pokemonsLs.data.results[i].name}`
      );

      const objPokemon = {
        name: PokemonsFeatures.data.name,
        id: PokemonsFeatures.data.id,
        number: PokemonsFeatures.data.id.toString().padStart(3, "0"),
        image:
          PokemonsFeatures.data.sprites.versions["generation-v"]["black-white"]
            .animated.front_default,
      };
      allPokemons.push(objPokemon);
    }

    RescuePokemons(allPokemons);
    arrayPokemons = allPokemons;
    ShowResult(allPokemons.length, allPokemons.slice(0, 1));
    setLoading(false; // error de sintax
  }

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
            <Row>
              {pokemons.map((item) => (
                <Col key={item.id} xs={12} sm={6} lg={3}>
                  <Card name={item.name} id={item.id} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;