import { Component } from '@angular/core';
import { SoundService } from '../../services/sound.service';
import { LogCategoryLiteral } from '@literals/log-category.literal';

@Component({
  selector: 'app-sound-tester-panel',
  templateUrl: './sound-tester.panel.component.html',
  styleUrls: ['./sound-tester.panel.component.css']
})
export class SoundTesterPanelComponent {
  public categories: LogCategoryLiteral[] = [
    'EQUIPPED','UNEQUIPPED','CHECK','CONSUMED','EQUIP-ERROR','TOOK','SCENE','MISSED','DIED','LOST','NOT-FOUND','OPENED','READ','USED','ACTIVATION','INTERACTED','AFFECTED','DENIED','VISIBILITY','AP','WEARING','STRIP','COOLDOWN'
  ];

  public volume = 30; // percent
  public enabled = true;

  constructor(private readonly sound: SoundService) {}

  play(cat: LogCategoryLiteral): void {
    this.sound.playSound(cat);
  }

  toggle(): void {
    this.enabled = !this.enabled;
    this.sound.toggleSound();
  }

  onVolumeChange(): void {
    this.sound.setVolume(this.volume / 100);
  }
}

