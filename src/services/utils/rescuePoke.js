export function RescuePokemons(list) {
    localStorage.setItem("pokemons", JSON.stringify(list));
  }