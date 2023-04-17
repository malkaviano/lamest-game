import { LazyHelper } from './lazy.helper';

describe('LazyHelper', () => {
  describe('lazy behavior', () => {
    describe('when accessing value first time', () => {
      it('return value', () => {
        const service = new LazyHelper<string>(() => 'GG');

        expect(service.value).toEqual('GG');
      });
    });

    describe('when accessing value after first time', () => {
      it('should have invoked the function only once', () => {
        let invoked = 0;

        const f = () => {
          invoked++;

          return 'GG';
        };

        const service = new LazyHelper<string>(f);

        (() => service.value)();
        (() => service.value)();
        (() => service.value)();

        expect(invoked).toEqual(1);

        expect(service.value).toEqual('GG');
      });
    });
  });
});
