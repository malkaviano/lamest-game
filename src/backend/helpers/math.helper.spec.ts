import { MathHelper } from '@helpers/math.helper';

describe('MathHelper', () => {
  describe('when the number is bellow the min value', () => {
    it('clamps the number to the min value', () => {
      const result = MathHelper.clamp(5, 10, 15);

      expect(result).toEqual(10);
    });
  });

  describe('when the number is above the max value', () => {
    it('clamps the number to the max value', () => {
      const result = MathHelper.clamp(20, 10, 15);

      expect(result).toEqual(15);
    });
  });

  describe('when the number is between the min and max value', () => {
    it('returns the number', () => {
      const result = MathHelper.clamp(12, 10, 15);

      expect(result).toEqual(12);
    });
  });
});
