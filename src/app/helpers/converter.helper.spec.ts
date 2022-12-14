import { ConverterHelper } from './converter.helper';

describe('ConverterHelper', () => {
  describe('mapToKeyValueInterface', () => {
    it('return KeyValueInterface', () => {
      const map = new Map<string, number>();

      map.set('gg', 12);
      map.set('xpto', 100);

      const result = helper.mapToKeyValueInterface(map);

      expect(result).toEqual({
        gg: 12,
        xpto: 100,
      });
    });
  });
});

const helper = new ConverterHelper();
