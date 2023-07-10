import { RandomIntHelper } from '@helpers/random-int.helper';

describe('RandomIntHelper', () => {
  const helper = new RandomIntHelper();

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  describe('getRandomInterval', () => {
    it('should generate numbers between 0 and 100', () => {
      const results: { [key: number]: boolean } = {};

      for (let index = 0; index < 500; index++) {
        const element = helper.getRandomInterval(0, 100);

        results[element] = true;
      }

      let final = true;

      for (const key in results) {
        final = final && (results[key] ?? false);
      }

      expect(final).toBe(true);
    });
  });
});
