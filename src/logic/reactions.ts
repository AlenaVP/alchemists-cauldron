import { REACTIONS, REACTIONS_BY_DIFFICULTY } from '../data/reactions';
import type { CauldronValues, Difficulty, IIngredient, IReaction } from '../types/game';
import { calculateCauldron } from './calculate-cauldron';

export function getReactions(difficulty: Difficulty): IReaction[] {
  const ids = REACTIONS_BY_DIFFICULTY[difficulty];
  return REACTIONS.filter((reaction) => ids.includes(reaction.id));
}

/**
 * Recalculates the values from the ingredient list every time:
 * plain sums first, then every active reaction in table order.
 */
export function applyReactions(ingredients: readonly IIngredient[], reactions: readonly IReaction[]): CauldronValues {
  const values = reactions
    .filter((reaction) => reaction.isActive(ingredients))
    .reduce((current, reaction) => reaction.apply(current), calculateCauldron(ingredients));
  return {
    temperature: Math.round(values.temperature),
    density: Math.round(values.density),
    magicPower: Math.round(values.magicPower),
  };
}

/** A reaction fires only when it changes from not active to active. */
export function getFiredReactions(
  before: readonly IIngredient[],
  after: readonly IIngredient[],
  reactions: readonly IReaction[],
): IReaction[] {
  return reactions.filter((reaction) => !reaction.isActive(before) && reaction.isActive(after));
}
