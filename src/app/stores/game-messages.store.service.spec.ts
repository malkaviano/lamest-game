import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { GameMessagesStoreService } from './game-messages.store.service';

describe('GameMessagesStoreService', () => {
  let service: GameMessagesStoreService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });

    service = TestBed.inject(GameMessagesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createEffectRestoredHPMessage', () => {
    it('return received REMEDY effect, healed 10 hp', () => {
      expect(service.createEffectRestoredHPMessage('REMEDY', '10')).toEqual(
        'received REMEDY effect, healed 10 hp'
      );
    });
  });

  describe('createEffectDamagedMessage', () => {
    it('return received 10 PROFANE damage', () => {
      expect(service.createEffectDamagedMessage('PROFANE', '10')).toEqual(
        'received 10 PROFANE damage'
      );
    });
  });

  describe('createHPDidNotChangeMessage', () => {
    it('return HP did not change', () => {
      expect(service.createHPDidNotChangeMessage()).toEqual(
        'HP did not change'
      );
    });
  });

  describe('createDestroyedByDamageMessage', () => {
    it('return received 5 FIRE damage and was destroyed', () => {
      expect(service.createDestroyedByDamageMessage('FIRE', '5')).toEqual(
        'received 5 FIRE damage and was destroyed'
      );
    });
  });

  describe('createActorIsDeadLogMessage', () => {
    it('return player: is dead', () => {
      expect(service.createActorIsDeadLogMessage('player')).toEqual(
        new LogMessageDefinition('DIED', 'player', 'is dead')
      );
    });
  });

  describe('createOpenedUsingMessage', () => {
    it('return was opened using ${item}', () => {
      expect(service.createOpenedUsingMessage('key')).toEqual(
        'was opened using key'
      );
    });
  });

  describe('createLockpickMovedMessage', () => {
    it('return lockpick moved LEFT', () => {
      expect(service.createLockpickMovedMessage('LEFT')).toEqual(
        'lockpick moved LEFT'
      );
    });
  });

  describe('createLockpickStuckMessage', () => {
    it('return lockpick got stuck moving UP', () => {
      expect(service.createLockpickStuckMessage('UP')).toEqual(
        'lockpick got stuck moving UP'
      );
    });
  });

  describe('createLockpickOpenedMessage', () => {
    it('return lockpick got stuck moving DOWN', () => {
      expect(service.createLockpickOpenedMessage('DOWN')).toEqual(
        'lockpick moved DOWN and opened the container'
      );
    });
  });

  describe('createLockpickJammedMessage', () => {
    it('return lockpick got stuck moving RIGHT and cannot be lockpicked anymore', () => {
      expect(service.createLockpickJammedMessage('RIGHT')).toEqual(
        'lockpick got stuck moving RIGHT and cannot be lockpicked anymore'
      );
    });
  });

  describe('createSkillCheckLogMessage', () => {
    it('return Brawl skill checked and rolled 87, it was a FAILURE', () => {
      expect(
        service.createSkillCheckLogMessage('player', 'Brawl', '87', 'FAILURE')
      ).toEqual(
        new LogMessageDefinition(
          'CHECK',
          'player',
          'Brawl skill checked and rolled 87, it was a FAILURE'
        )
      );
    });
  });

  describe('createCannotCheckSkillLogMessage', () => {
    it("return Disguise skill couldn't be checked because it's value is zero", () => {
      expect(
        service.createCannotCheckSkillLogMessage('player', 'Disguise')
      ).toEqual(
        new LogMessageDefinition(
          'CHECK',
          'player',
          "Disguise skill couldn't be checked because it's value is zero"
        )
      );
    });
  });

  describe('createEquippedLogMessage', () => {
    it('return equipped sword', () => {
      expect(service.createEquippedLogMessage('player', 'sword')).toEqual(
        new LogMessageDefinition('EQUIPPED', 'player', 'equipped sword')
      );
    });
  });

  describe('createUnEquippedLogMessage', () => {
    it('return un-equipped sword', () => {
      expect(service.createUnEquippedLogMessage('player', 'sword')).toEqual(
        new LogMessageDefinition('UNEQUIPPED', 'player', 'un-equipped sword')
      );
    });
  });

  describe('createConsumedLogMessage', () => {
    it('return consumed drink', () => {
      expect(service.createConsumedLogMessage('player', 'drink')).toEqual(
        new LogMessageDefinition('CONSUMED', 'player', 'consumed drink')
      );
    });
  });

  describe('createUsedItemLogMessage', () => {
    it('return used weapon on actor', () => {
      expect(
        service.createUsedItemLogMessage('player', 'actor', 'weapon')
      ).toEqual(
        new LogMessageDefinition('USED', 'player', 'used weapon on actor')
      );
    });
  });

  describe('createEquipErrorLogMessage', () => {
    it('return SkillX is required to equip weapon', () => {
      expect(
        service.createEquipErrorLogMessage('player', 'SkillX', 'weapon')
      ).toEqual(
        new LogMessageDefinition(
          'EQUIP-ERROR',
          'player',
          'SkillX is required to equip weapon'
        )
      );
    });
  });

  describe('createTookLogMessage', () => {
    it('return took weapon from table', () => {
      expect(service.createTookLogMessage('player', 'table', 'weapon')).toEqual(
        new LogMessageDefinition('TOOK', 'player', 'took weapon from table')
      );
    });
  });

  describe('createSceneLogMessage', () => {
    it('return selected door from exit', () => {
      expect(service.createSceneLogMessage('player', 'exit', 'door')).toEqual(
        new LogMessageDefinition('SCENE', 'player', 'selected door from exit')
      );
    });
  });

  describe('createLostLogMessage', () => {
    it('return lost key', () => {
      expect(service.createLostLogMessage('player', 'key')).toEqual(
        new LogMessageDefinition('LOST', 'player', 'lost key')
      );
    });
  });

  describe('createUnDodgeableAttackLogMessage', () => {
    it('return attack is not dodgeable', () => {
      expect(service.createUnDodgeableAttackLogMessage('player')).toEqual(
        new LogMessageDefinition(
          'ATTACKED',
          'player',
          'attack is not dodgeable'
        )
      );
    });
  });

  describe('createNotFoundLogMessage', () => {
    it('return inspect failed, required item was not found in inventory', () => {
      expect(service.createNotFoundLogMessage('player', 'inspect')).toEqual(
        new LogMessageDefinition(
          'NOT-FOUND',
          'player',
          'inspect failed, required item was not found in inventory'
        )
      );
    });
  });

  describe('createItemInspectedLogMessage', () => {
    it('return inspected diary', () => {
      expect(service.createItemInspectedLogMessage('player', 'diary')).toEqual(
        new LogMessageDefinition('INSPECTED', 'player', 'inspected diary')
      );
    });
  });

  describe('createOutOfDodgesLogMessage', () => {
    it('return was out of dodges', () => {
      expect(service.createOutOfDodgesLogMessage('player')).toEqual(
        new LogMessageDefinition('ATTACKED', 'player', 'was out of dodges')
      );
    });
  });

  describe('createEnergizedMessage', () => {
    it('return restored 10 energy', () => {
      expect(service.createEnergizedMessage('10')).toEqual(
        'restored 10 energy'
      );
    });
  });

  describe('createEnergyDrainedMessage', () => {
    it('return lost 10 energy', () => {
      expect(service.createEnergyDrainedMessage('10')).toEqual(
        'lost 10 energy'
      );
    });
  });

  describe('createEnergyDidNotChangeMessage', () => {
    it('return EP did not change', () => {
      expect(service.createEnergyDidNotChangeMessage()).toEqual(
        'EP did not change'
      );
    });
  });

  describe('createNotEnoughEnergyLogMessage', () => {
    it('return not enough energy to activate sprint', () => {
      expect(
        service.createNotEnoughEnergyLogMessage('player', 'sprint')
      ).toEqual(
        new LogMessageDefinition(
          'ACTIVATION',
          'player',
          'not enough energy to activate sprint'
        )
      );
    });
  });

  describe('createEnergySpentLogMessage', () => {
    it('return spent 5 EP to activate sprint', () => {
      expect(
        service.createEnergySpentLogMessage('player', '5', 'sprint')
      ).toEqual(
        new LogMessageDefinition(
          'ACTIVATION',
          'player',
          'spent 5 EP to activate sprint'
        )
      );
    });
  });

  describe('createFreeLogMessage', () => {
    it('return any message type', () => {
      expect(
        service.createFreeLogMessage('ACTIVATION', 'player', 'any message type')
      ).toEqual(
        new LogMessageDefinition('ACTIVATION', 'player', 'any message type')
      );
    });
  });
});
