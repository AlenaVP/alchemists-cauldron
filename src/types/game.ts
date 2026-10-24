export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export type GameOverReason = 'time' | 'lives' | 'ingredients';

export type ParameterKey = 'temperature' | 'density' | 'magicPower';

export type IconName = 'drop' | 'sparkle' | 'snowflake' | 'leaf' | 'flask' | 'moon' | 'flame' | 'toad';

export interface IIngredient {
  id: string;
  name: string;
  icon: IconName;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

/** Current totals of the 3 cauldron parameters. */
export type CauldronValues = Record<ParameterKey, number>;

export interface IDifficultySettings {
  label: string;
  shelfSize: number;
  maxCauldronIngredients: number;
  /** Seconds */
  startTime: number;
  tolerance: number;
  lives: number;
  scorePerBrew: number;
  /** Seconds */
  timeBonus: number;
  reactionCount: number;
}

export type BrewResult = 'success' | 'failure';

export interface IGameState {
  status: GameStatus;
  difficulty: Difficulty;
  score: number;
  /** Milliseconds */
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | null;
  cauldronIngredients: IIngredient[];
  /** Ingredient id -> portions left */
  shelfStock: Record<string, number>;
  lastBrew: BrewResult | null;
  gameOverReason: GameOverReason | null;
}

export interface ILeaderboardEntry {
  name: string;
  score: number;
  /** Timestamp of the result */
  date: number;
  difficulty: Difficulty;
}
