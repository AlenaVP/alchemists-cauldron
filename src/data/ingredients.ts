import type { IIngredient } from '../types/game';

/** Fixed ordered catalogue from the task README. Level 1 uses the first 6. */
export const INGREDIENTS: readonly IIngredient[] = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    icon: 'drop',
    temperature: 25,
    density: 8,
    magicPower: 10,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    icon: 'sparkle',
    temperature: 12,
    density: 9,
    magicPower: 12,
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    icon: 'snowflake',
    temperature: -18,
    density: 4,
    magicPower: 14,
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    icon: 'leaf',
    temperature: -5,
    density: 20,
    magicPower: 8,
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    icon: 'flask',
    temperature: 10,
    density: 14,
    magicPower: 22,
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    icon: 'moon',
    temperature: -20,
    density: -10,
    magicPower: 40,
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    icon: 'flame',
    temperature: 50,
    density: -10,
    magicPower: 30,
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    icon: 'toad',
    temperature: 5,
    density: 30,
    magicPower: 0,
  },
];

export function findIngredient(id: string): IIngredient | undefined {
  return INGREDIENTS.find((ingredient) => ingredient.id === id);
}
