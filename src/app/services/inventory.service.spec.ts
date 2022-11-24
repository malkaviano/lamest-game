import { TestBed } from '@angular/core/testing';

import { take } from 'rxjs';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { InventoryEvent } from '../events/inventory.event';
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

  describe('equipped', () => {
    describe('when created', () => {
      it('return equipped null', () => {
        expect(service.equipped).toBeNull();
      });
    });

    describe('when equipping an item', () => {
      describe('when item is in inventory', () => {
        it('should equip the item', () => {
          service.store('player', weapon1);

          service.equip(weapon1.name);

          expect(service.equipped).toEqual(weapon1);
        });

        it('should push equip InventoryEvent', (done) => {
          let result: InventoryEvent | undefined;

          const expected = new InventoryEvent('EQUIP', 'player', weapon1);

          service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
            result = event;
          });

          service.store('player', weapon1);

          service.equip(weapon1.name);

          done();

          expect(result).toEqual(expected);
        });

        it('should remove the item from player inventory', () => {
          service.store('player', weapon1);

          service.equip(weapon1.name);

          expect(service.check('player')).toEqual(new ArrayView([]));
        });

        describe('when another item is equipped', () => {
          it('should equip new item', () => {
            service.store('player', weapon1);

            service.store('player', weapon2);

            service.equip(weapon1.name);

            service.equip(weapon2.name);

            expect(service.equipped).toEqual(weapon2);
          });

          it('should store previous equipped item', () => {
            service.store('player', weapon1);

            service.store('player', weapon2);

            service.equip(weapon1.name);

            service.equip(weapon2.name);

            expect(service.check('player')).toEqual(
              new ArrayView([new ItemStorageDefinition(weapon1, 1)])
            );
          });
        });
      });

      describe('when item is not in inventory', () => {
        it('throw INVALID-OPERATION', () => {
          expect(() => service.equip(weapon1.name)).toThrowError(
            errorMessages['INVALID-OPERATION']
          );
        });
      });

      describe('when item is not a weapon', () => {
        it('throw WRONG-ITEM', () => {
          service.store('player', bubbleGum);

          expect(() => service.equip(bubbleGum.name)).toThrowError(
            errorMessages['WRONG-ITEM']
          );
        });
      });
    });
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

    it('should push store InventoryEvent', (done) => {
      let result: InventoryEvent | undefined;

      const expected = new InventoryEvent('STORE', 'storeEvent', weapon2);

      service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      service.store('storeEvent', weapon2);

      done();

      expect(result).toEqual(expected);
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

      it('should push take InventoryEvent', (done) => {
        let result: InventoryEvent | undefined;

        const expected = new InventoryEvent('TAKE', 'takeEvent', bubbleGum);

        service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        service.store('takeEvent', bubbleGum);

        service.take('takeEvent', bubbleGum.name);

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

  describe('unequip', () => {
    describe('when no item was equipped', () => {
      it('throw INVALID-OPERATION', () => {
        expect(() => service.unequip()).toThrowError(
          errorMessages['INVALID-OPERATION']
        );
      });
    });

    describe('when an item was equipped', () => {
      it('should unequip', () => {
        service.store('player', weapon1);

        service.equip(weapon1.name);

        service.unequip();

        expect(service.equipped).toBeNull();
      });

      it('should store the item back in player inventory', () => {
        service.store('player', weapon1);

        service.equip(weapon1.name);

        service.unequip();

        expect(service.check('player')).toEqual(
          new ArrayView([new ItemStorageDefinition(weapon1, 1)])
        );
      });

      it('should push unequip InventoryEvent', (done) => {
        let result: InventoryEvent | undefined;

        const expected = new InventoryEvent('UNEQUIP', 'player', weapon1);

        service.inventoryChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        service.store('player', weapon1);

        service.equip(weapon1.name);

        service.unequip();

        done();

        expect(result).toEqual(expected);
      });
    });
  });
});

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0)
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Decent Sword',
  'A good sword, not exceptional',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0)
);

const bubbleGum = new ConsumableDefinition(
  'bubbleGum',
  'Bubble Gum',
  'Refreshing'
);
