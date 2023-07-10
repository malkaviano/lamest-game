import { instance } from 'ts-mockito';

import { ItemStoredDefinition } from '@core/definitions/item-storage.definition';
import { InventoryService } from './inventory.service';
import { ArrayView } from '@core/view-models/array.view';
import { InventoryEvent } from '@core/events/inventory.event';

import {
  consumableAnalgesic,
  greatSword,
  masterKey,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { mockedItemStore } from '../../../tests/mocks';
import { InteractiveStore } from '../../stores/interactive.store';

const interactives = {
  interactives: () => ({}),
  interactiveItems: () => ({}),
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService(
      interactives as unknown as InteractiveStore,
      instance(mockedItemStore)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('storing an item', () => {
    describe('when the store is empty', () => {
      it('return 1 item', () => {
        const result = service.store('store', simpleSword);

        expect(result).toEqual(1);
      });
    });

    describe('when storing the same item', () => {
      it('return quantity 2', () => {
        service.store('store', simpleSword);

        const result = service.store('store', simpleSword);

        expect(result).toEqual(2);
      });
    });

    describe('when storing different items', () => {
      it('return 1 item each', () => {
        const result1 = service.store('store', simpleSword);

        const result2 = service.store('store', greatSword);

        expect(result1).toEqual(1);

        expect(result2).toEqual(1);
      });
    });

    it('should push store InventoryEvent', (done) => {
      let result: InventoryEvent | undefined;

      const expected = new InventoryEvent('STORE', 'storeEvent', greatSword);

      service.inventoryChanged$.subscribe((event) => {
        result = event;
      });

      service.store('storeEvent', greatSword);

      done();

      expect(result).toEqual(expected);
    });
  });

  describe('taking an item', () => {
    describe('when the item is not found', () => {
      it('return null', () => {
        service.store('take', simpleSword);

        expect(service.take('take', 'wrongName')).toBeNull();
      });
    });

    describe('when the store has the item', () => {
      [simpleSword, consumableAnalgesic, readable, masterKey].forEach(
        (item) => {
          it('return the item', () => {
            service.store('take', item);

            const result = service.take('take', item.identity.name);

            expect(result).toEqual(item);
          });
        }
      );

      describe('when quantity is 1', () => {
        it('should remove the item from storage', () => {
          service.store('take', simpleSword);

          service.take('take', simpleSword.identity.name);

          const expected: ArrayView<ItemStoredDefinition> = ArrayView.empty();

          const result = service.list('take');

          expect(result).toEqual(expected);
        });
      });

      describe('when quantity is 2', () => {
        it('should keep 1 item in storage', () => {
          service.store('take', simpleSword);

          service.store('take', simpleSword);

          service.take('take', simpleSword.identity.name);

          const expected = ArrayView.create(
            new ItemStoredDefinition(simpleSword, 1)
          );

          const result = service.list('take');

          expect(result).toEqual(expected);
        });
      });

      it('should push take InventoryEvent', (done) => {
        let result: InventoryEvent | undefined;

        const expected = new InventoryEvent(
          'TAKE',
          'takeEvent',
          consumableAnalgesic
        );

        service.inventoryChanged$.subscribe((event) => {
          result = event;
        });

        service.store('takeEvent', consumableAnalgesic);

        service.take('takeEvent', consumableAnalgesic.identity.name);

        done();

        expect(result).toEqual(expected);
      });
    });
  });

  describe('listing items stored', () => {
    describe('when storage is empty', () => {
      it('return empty', () => {
        const expected: ArrayView<ItemStoredDefinition> = ArrayView.empty();

        const result = service.list('check');

        expect(result).toEqual(expected);
      });
    });

    describe('when storage has items', () => {
      it('return items stored on storage', () => {
        const expected = ArrayView.create(
          new ItemStoredDefinition(simpleSword, 1),
          new ItemStoredDefinition(greatSword, 2)
        );

        service.store('check', simpleSword);

        service.store('check', greatSword);

        service.store('check', greatSword);

        const result = service.list('check');

        expect(result).toEqual(expected);
      });
    });
  });

  describe('looking an item', () => {
    describe('when the item is not found', () => {
      it('return null', () => {
        service.store('look', simpleSword);

        expect(service.look('look', 'wrongName')).toBeNull();
      });
    });

    describe('when the store has the item', () => {
      [simpleSword, consumableAnalgesic, readable, masterKey].forEach(
        (item) => {
          it('return the item', () => {
            service.store('look', item);

            const result = service.look('look', item.identity.name);

            expect(result).toEqual(item);
          });
        }
      );
    });
  });
});
