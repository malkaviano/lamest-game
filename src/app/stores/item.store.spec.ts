import { TestBed } from '@angular/core/testing';
import { ItemStore } from './item.store';

describe('ItemStore', () => {
  let service: ItemStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemStore);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('itemSkill', () => {
    describe('when item had skill requirement', () => {
      it('return skill name', () => {
        const result = service.itemSkill('knife');

        expect(result).toEqual('Melee Weapon (Simple)');
      });
    });

    describe('when item did not have skill requirement', () => {
      it('return skill name', () => {
        const result = service.itemSkill('bubbleGum');

        expect(result).toBeNull();
      });
    });
  });

  describe('itemLabel', () => {
    it('return item label', () => {
      const result = service.itemLabel('knife');

      expect(result).toEqual('Hunting Knife');
    });
  });
});
