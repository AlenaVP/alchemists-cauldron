import type { Difficulty, IRecipe } from '../types/game';

type RecipeRow = [
  name: string,
  difficulty: Difficulty,
  temperature: [number, number],
  density: [number, number],
  magicPower: [number, number],
];

/** The 20 recipes from the task README, in the same order. */
const RECIPE_ROWS: readonly RecipeRow[] = [
  ['Moon Mist', 'easy', [32, 42], [12, 22], [17, 27]],
  ['Root Bloom', 'easy', [2, 12], [24, 34], [15, 25]],
  ['Frost Steam', 'easy', [2, 12], [7, 17], [19, 29]],
  ['Quiet Swirl', 'easy', [-28, -18], [19, 29], [17, 27]],
  ['Bright Dew', 'easy', [27, 37], [32, 42], [25, 35]],
  ['Snow Dust', 'easy', [-16, -6], [28, 38], [29, 39]],
  ['Acid Spark', 'medium', [17, 27], [18, 28], [29, 39]],
  ['Void Ember', 'medium', [0, 10], [0, 10], [45, 55]],
  ['Heavy Acid', 'medium', [0, 10], [29, 39], [25, 35]],
  ['Frost Acid', 'medium', [-13, -3], [13, 23], [31, 41]],
  ['Dusty Void', 'medium', [-13, -3], [0, 10], [47, 57]],
  ['Dragon Void', 'medium', [25, 35], [1, 11], [55, 65]],
  ['Rooted Night', 'medium', [-18, -8], [14, 24], [55, 65]],
  ['Phoenix Pulse', 'hard', [57, 67], [0, 10], [37, 47]],
  ['Slime Crown', 'hard', [-5, 5], [45, 55], [3, 13]],
  ['Void Flame', 'hard', [25, 35], [0, 10], [60, 70]],
  ['Acid Bog', 'hard', [10, 20], [39, 49], [17, 27]],
  ['Frozen Ash', 'hard', [27, 37], [0, 10], [39, 49]],
  ['Triple Eclipse', 'hard', [-20, -10], [19, 29], [60, 70]],
  ['Ember Soup', 'hard', [62, 72], [24, 34], [37, 47]],
];

const toId = (name: string): string => name.toLowerCase().replaceAll(' ', '-');

export const RECIPES: readonly IRecipe[] = RECIPE_ROWS.map(([name, difficulty, temperature, density, magicPower]) => ({
  id: toId(name),
  name,
  difficulty,
  temperature: { min: temperature[0], max: temperature[1] },
  density: { min: density[0], max: density[1] },
  magicPower: { min: magicPower[0], max: magicPower[1] },
}));

export function findRecipe(id: string): IRecipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}
