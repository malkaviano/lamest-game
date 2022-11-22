import { TestBed } from '@angular/core/testing';
import { errorMessages } from '../definitions/error-messages.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ArrayView } from '../views/array.view';

import { InventoryService } from './inventory.service';

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
        const result = service.store('store', weapon1);

        expect(result).toEqual(1);
      });
    });

    describe('when storing the same item', () => {
      it('return quantity 2', () => {
        service.store('store', weapon1);

        const result = service.store('store', weapon1);

        expect(result).toEqual(2);
      });
    });

    describe('when storing different items', () => {
      it('return 1 item each', () => {
        const result1 = service.store('store', weapon1);

        const result2 = service.store('store', weapon2);

        expect(result1).toEqual(1);

        expect(result2).toEqual(1);
      });
    });
  });

  describe('taking an item', () => {
    describe('when the store is empty', () => {
      it('throws INVALID-OPERATION', () => {
        expect(() => service.take('take', 'sword')).toThrowError(
          errorMessages['INVALID-OPERATION']
        );
      });
    });

    describe('when the item is not found', () => {
      it('throws INVALID-OPERATION', () => {
        service.store('take', weapon1);

        expect(() => service.take('take', 'sword')).toThrowError(
          errorMessages['INVALID-OPERATION']
        );
      });
    });

    describe('when the store has the item', () => {
      it('return the item', () => {
        service.store('take', weapon1);

        const result = service.take('take', 'sword1');

        expect(result).toEqual(weapon1);
      });

      describe('when quantity is 1', () => {
        it('should remove the item from storage', () => {
          service.store('take', weapon1);

          service.take('take', 'sword1');

          const expected = new ArrayView([]);

          const result = service.check('take');

          expect(result).toEqual(expected);
        });
      });

      describe('when quantity is 2', () => {
        it('should keep 1 item in storage', () => {
          service.store('take', weapon1);

          service.store('take', weapon1);

          service.take('take', 'sword1');

          const expected = new ArrayView([
            new ItemStorageDefinition(weapon1, 1),
          ]);

          const result = service.check('take');

          expect(result).toEqual(expected);
        });
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
          new ItemStorageDefinition(weapon1, 1),
          new ItemStorageDefinition(weapon2, 2),
        ]);

        service.store('check', weapon1);

        service.store('check', weapon2);

        service.store('check', weapon2);

        const result = service.check('check');

        expect(result).toEqual(expected);
      });
    });
  });
});

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust'
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Decent Sword',
  'A good sword, not exceptional'
);
