export function getPokemonImage(id) {
  id = id.toString().padStart(3, "0");
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png`;
}