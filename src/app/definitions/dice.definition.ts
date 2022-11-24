import { DiceLiteral } from '../literals/dice.literal';

export type Dice = {
  readonly [key in DiceLiteral]: number;
};

export const createDice = (dice: {
  D4?: number;
  D6?: number;
  D8?: number;
  D10?: number;
  D12?: number;
  D20?: number;
  D100?: number;
}) => {
  return {
    D4: dice['D4'] ?? 0,
    D6: dice['D6'] ?? 0,
    D8: dice['D8'] ?? 0,
    D10: dice['D10'] ?? 0,
    D12: dice['D12'] ?? 0,
    D20: dice['D20'] ?? 0,
    D100: dice['D100'] ?? 0,
  };
};
