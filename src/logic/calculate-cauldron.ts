import type { CauldronValues, IIngredient, ParameterKey } from '../types/game';

export const PARAMETER_KEYS: readonly ParameterKey[] = ['temperature', 'density', 'magicPower'];

export const EMPTY_VALUES: Readonly<CauldronValues> = { temperature: 0, density: 0, magicPower: 0 };

/** Pure sum of the 3 parameters of every ingredient in the cauldron. */
export function calculateCauldron(ingredients: readonly IIngredient[]): CauldronValues {
  return ingredients.reduce<CauldronValues>(
    (total, ingredient) => ({
      temperature: total.temperature + ingredient.temperature,
      density: total.density + ingredient.density,
      magicPower: total.magicPower + ingredient.magicPower,
    }),
    { ...EMPTY_VALUES },
  );
}
