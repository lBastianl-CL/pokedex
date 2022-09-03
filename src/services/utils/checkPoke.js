export function CheckPokemons() {
    var pokemons = localStorage.getItem("pokemons");
    return JSON.parse(pokemons);
  }