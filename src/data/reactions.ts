import { calculateCauldron } from '../logic/calculate-cauldron';
import type { Difficulty, IIngredient, IReaction } from '../types/game';

const has = (ingredients: readonly IIngredient[], ...ids: string[]): boolean =>
  ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));

/** Stats reactions look at the plain sums, before any reaction changes them. */
const total = calculateCauldron;

/** The full reaction table from US 3.3, in the same order. */
export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    description: 'Fairy Dust + Caustic Acid: Magic Power +50%, −10 s once',
    isActive: (list) => has(list, 'fairy-dust', 'caustic-acid'),
    apply: (v) => ({ ...v, magicPower: v.magicPower * 1.5 }),
    effects: { timePenalty: 10 },
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    description: 'Phoenix Feather + Essence of the Void: −1 life, the cauldron is cleared',
    isActive: (list) => has(list, 'phoenix-feather', 'essence-of-the-void'),
    apply: (v) => v,
    effects: { lifePenalty: 1, clearCauldron: true },
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    description: 'Dragon Tears + Frost Lotus: Temperature becomes 0, Density +20%',
    isActive: (list) => has(list, 'dragon-tears', 'frost-lotus'),
    apply: (v) => ({ ...v, temperature: 0, density: v.density * 1.2 }),
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    description: 'Mandrake Root + Toad Slime: Density +25%, Magic Power −10%',
    isActive: (list) => has(list, 'mandrake-root', 'toad-slime'),
    apply: (v) => ({ ...v, density: v.density * 1.25, magicPower: v.magicPower * 0.9 }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    description: 'Phoenix Feather + Fairy Dust: Temperature +10, Magic Power +25%',
    isActive: (list) => has(list, 'phoenix-feather', 'fairy-dust'),
    apply: (v) => ({ ...v, temperature: v.temperature + 10, magicPower: v.magicPower * 1.25 }),
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    description: 'A hot (> +15) and a cold (< −15) ingredient: Temperature becomes 0, Density ×2',
    isActive: (list) => list.some((item) => item.temperature > 15) && list.some((item) => item.temperature < -15),
    apply: (v) => ({ ...v, temperature: 0, density: v.density * 2 }),
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    description: 'Total Density ≥ 70: Density becomes 70, Magic Power +10%',
    isActive: (list) => total(list).density >= 70,
    apply: (v) => ({ ...v, density: 70, magicPower: v.magicPower * 1.1 }),
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    description: 'Total Temperature ≥ 60: Magic Power +20%, Density −10%',
    isActive: (list) => total(list).temperature >= 60,
    apply: (v) => ({ ...v, magicPower: v.magicPower * 1.2, density: v.density * 0.9 }),
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    description: 'Total Temperature ≤ −20: Density +15%, Magic Power −15%',
    isActive: (list) => total(list).temperature <= -20,
    apply: (v) => ({ ...v, density: v.density * 1.15, magicPower: v.magicPower * 0.85 }),
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    description: 'Total Magic Power ≥ 80: Magic Power becomes 80, Temperature +5',
    isActive: (list) => total(list).magicPower >= 80,
    apply: (v) => ({ ...v, magicPower: 80, temperature: v.temperature + 5 }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    description: 'Dragon Tears + Caustic Acid and Temperature ≥ 35: Temperature +10, −5 s once',
    isActive: (list) => has(list, 'dragon-tears', 'caustic-acid') && total(list).temperature >= 35,
    apply: (v) => ({ ...v, temperature: v.temperature + 10 }),
    effects: { timePenalty: 5 },
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    description: 'Frost Lotus + Essence of the Void and Density ≤ 0: Temperature −10, Magic Power +20%',
    isActive: (list) => has(list, 'frost-lotus', 'essence-of-the-void') && total(list).density <= 0,
    apply: (v) => ({ ...v, temperature: v.temperature - 10, magicPower: v.magicPower * 1.2 }),
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    description: 'Fairy Dust + Toad Slime and Density ≥ 40: Density +20%, Magic Power +10%',
    isActive: (list) => has(list, 'fairy-dust', 'toad-slime') && total(list).density >= 40,
    apply: (v) => ({ ...v, density: v.density * 1.2, magicPower: v.magicPower * 1.1 }),
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    description: 'Mandrake Root + Phoenix Feather and Temperature ≥ 40: Temperature +15, Density −10%',
    isActive: (list) => has(list, 'mandrake-root', 'phoenix-feather') && total(list).temperature >= 40,
    apply: (v) => ({ ...v, temperature: v.temperature + 15, density: v.density * 0.9 }),
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    description: 'Essence of the Void + Dragon Tears and Magic Power ≥ 50: Magic Power +30%, Temperature −5',
    isActive: (list) => has(list, 'essence-of-the-void', 'dragon-tears') && total(list).magicPower >= 50,
    apply: (v) => ({ ...v, magicPower: v.magicPower * 1.3, temperature: v.temperature - 5 }),
  },
];

/**
 * Configured subsets (Easy none, Medium 2, Hard 3). Medium uses only the first
 * 6 ingredients, so its reactions are built from them; Hard adds reactions
 * with Phoenix Feather and Toad Slime.
 */
export const REACTIONS_BY_DIFFICULTY: Readonly<Record<Difficulty, readonly string[]>> = {
  easy: [],
  medium: ['bubbling', 'solar-frost'],
  hard: ['volatile-mix', 'rooted-steam', 'magma-flux'],
};
