import { TestBed } from '@angular/core/testing';

import { take } from 'rxjs';

import { errorMessages } from '../definitions/error-messages.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';
import { InventoryService } from './inventory.service';

import { bubbleGum, greatSword, simpleSword } from '../../../tests/fakes';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(InventoryService);
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

      service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      service.store('storeEvent', greatSword);

      done();

      expect(result).toEqual(expected);
    });
  });

  describe('taking an item', () => {
    describe('when the store is empty', () => {
      it('throws INVALID-OPERATION', () => {
        expect(() =>
          service.take('take', simpleSword.identity.name)
        ).toThrowError(errorMessages['INVALID-OPERATION']);
      });
    });

    describe('when the item is not found', () => {
      it('throws INVALID-OPERATION', () => {
        service.store('take', simpleSword);

        expect(() => service.take('take', 'wrongName')).toThrowError(
          errorMessages['INVALID-OPERATION']
        );
      });
    });

    describe('when the store has the item', () => {
      it('return the item', () => {
        service.store('take', simpleSword);

        const result = service.take('take', simpleSword.identity.name);

        expect(result).toEqual(simpleSword);
      });

      describe('when quantity is 1', () => {
        it('should remove the item from storage', () => {
          service.store('take', simpleSword);

          service.take('take', simpleSword.identity.name);

          const expected = new ArrayView([]);

          const result = service.check('take');

          expect(result).toEqual(expected);
        });
      });

      describe('when quantity is 2', () => {
        it('should keep 1 item in storage', () => {
          service.store('take', simpleSword);

          service.store('take', simpleSword);

          service.take('take', simpleSword.identity.name);

          const expected = new ArrayView([
            new ItemStorageDefinition(simpleSword, 1),
          ]);

          const result = service.check('take');

          expect(result).toEqual(expected);
        });
      });

      it('should push take InventoryEvent', (done) => {
        let result: InventoryEvent | undefined;

        const expected = new InventoryEvent('TAKE', 'takeEvent', bubbleGum);

        service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        service.store('takeEvent', bubbleGum);

        service.take('takeEvent', bubbleGum.identity.name);

        done();

        expect(result).toEqual(expected);
      });
    });
  });

  describe('checking items stored', () => {
    describe('when storage is empty', () => {
      it('return empty', () => {
        const expected = new ArrayView([]);

        const result = service.check('check');

        expect(result).toEqual(expected);
      });
    });

    describe('when storage has items', () => {
      it('return items stored on storage', () => {
        const expected = new ArrayView([
          new ItemStorageDefinition(simpleSword, 1),
          new ItemStorageDefinition(greatSword, 2),
        ]);

        service.store('check', simpleSword);

        service.store('check', greatSword);

        service.store('check', greatSword);

        const result = service.check('check');

        expect(result).toEqual(expected);
      });
    });
  });
});
