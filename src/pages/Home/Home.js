import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../layouts/Header/Header";
import Card from "../../components/Poke/Card";
import pokeapi from "../../services/api/pokeapi";
import Search from "../../components/Search/Search";
import { RescuePokemons } from "../../services/utils/rescuePoke";
import { CheckPokemons } from "../../services/utils/checkPoke";
import "./styles.css";

var arrayPokemons = [];
const limit = 320; // 898 2022/09/01
var maxamountpokemons = 0;
var maximum = 0;

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
      return false;
    }

    history.push(`/${query}`);
    var filterPokemons = arrayPokemons.filter((item) => {
      return (
        item.name.includes(query.toLowerCase()) || item.number.includes(query)
      );
    });

    ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
    setLoading(false);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    var listLocal = CheckPokemons();
    if (listLocal === null) {
      LoadPokemons();
      return false;
    }
    arrayPokemons = listLocal;
    if (query !== undefined) {
      var filterPokemons = listLocal.filter(
        (i) => i.name.includes(query.toLowerCase()) || i.number.includes(query)
      );

      ShowResult(filterPokemons.length, filterPokemons.slice(0, 1));
    } else {
      ShowResult(listLocal.length, listLocal.slice(0, 1));
    }
    setLoading(false);
  }, []);

  async function LoadPokemons() {
    let pokemonsLs = await pokeapi.get(`/pokemon?limit=${limit}`);
    var allPokemons = [];
    for (var i = 0; i < pokemonsLs.data.results.length; i++) {
      let PokemonsFeatures = await pokeapi.get(
        `/pokemon/${pokemonsLs.data.results[i].name}`
      );

      var obj = {
        name: PokemonsFeatures.data.name,
        id: PokemonsFeatures.data.id,
        number: PokemonsFeatures.data.id.toString().padStart(3, "0"),
        image:
          PokemonsFeatures.data.sprites.versions["generation-v"]["black-white"]
            .animated.front_default,
      };
      allPokemons.push(obj);
    }

    RescuePokemons(allPokemons);
    arrayPokemons = allPokemons;
    ShowResult(allPokemons.length, allPokemons.slice(0,1));
    setLoading(false);
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <Search history={history} query={query} />
        {(
          <div className="box">
            <div>
              <Row>
                {pokemons.map((item) => {
                  return (
                    <Col key={item.id} xs={12} sm={6} lg={3}>
                      <Card
                        name={item.name}
                        id={item.id}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>

        )}
      </Container>
    </div>
  );
}

export default Home;
