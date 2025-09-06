import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LogCategoryLiteral } from '@literals/log-category.literal';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private toastr: ToastrService,
    private soundService: SoundService
  ) {}

  public showFeedback(log: LogMessageDefinition): void {
    this.showToast(log);
    this.soundService.playSound(log.category);
  }

  private showToast(log: LogMessageDefinition): void {
    const config = this.getToastConfig(log.category);
    const title = this.getToastTitle(log.category);
    const message = `${log.actor}: ${log.message}`;

    switch (config.type) {
      case 'success':
        this.toastr.success(message, title, config.options);
        break;
      case 'error':
        this.toastr.error(message, title, config.options);
        break;
      case 'warning':
        this.toastr.warning(message, title, config.options);
        break;
      case 'info':
        this.toastr.info(message, title, config.options);
        break;
    }
  }

  private getToastConfig(category: LogCategoryLiteral) {
    const configs = {
      // Success actions (green)
      'EQUIPPED': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'TOOK': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'CONSUMED': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'OPENED': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'READ': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'USED': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'INTERACTED': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      'WEARING': { type: 'success' as const, options: { positionClass: 'toast-top-right' }},
      
      // Error actions (red)  
      'DIED': { type: 'error' as const, options: { positionClass: 'toast-top-center', timeOut: 5000 }},
      'EQUIP-ERROR': { type: 'error' as const, options: { positionClass: 'toast-top-right' }},
      'NOT-FOUND': { type: 'error' as const, options: { positionClass: 'toast-top-right' }},
      'DENIED': { type: 'error' as const, options: { positionClass: 'toast-top-right' }},
      'LOST': { type: 'error' as const, options: { positionClass: 'toast-top-right' }},

      // Warning actions (orange)
      'MISSED': { type: 'warning' as const, options: { positionClass: 'toast-top-center' }},
      'COOLDOWN': { type: 'warning' as const, options: { positionClass: 'toast-top-right' }},
      'UNEQUIPPED': { type: 'warning' as const, options: { positionClass: 'toast-top-right' }},
      'STRIP': { type: 'warning' as const, options: { positionClass: 'toast-top-right' }},

      // Info actions (blue)
      'CHECK': { type: 'info' as const, options: { positionClass: 'toast-top-left' }},
      'SCENE': { type: 'info' as const, options: { positionClass: 'toast-bottom-center', timeOut: 2000 }},
      'AFFECTED': { type: 'info' as const, options: { positionClass: 'toast-top-center' }},
      'VISIBILITY': { type: 'info' as const, options: { positionClass: 'toast-top-center' }},
      'AP': { type: 'info' as const, options: { positionClass: 'toast-top-left' }},
      'ACTIVATION': { type: 'info' as const, options: { positionClass: 'toast-top-right' }}
    };

    return configs[category] || { type: 'info' as const, options: { positionClass: 'toast-top-right' }};
  }

  private getToastTitle(category: LogCategoryLiteral): string {
    const titles = {
      'EQUIPPED': '⚔️ Equipment',
      'UNEQUIPPED': '📦 Equipment', 
      'TOOK': '📦 Inventory',
      'CONSUMED': '🍾 Item Used',
      'DIED': '💀 Death',
      'MISSED': '🎯 Combat',
      'AFFECTED': '⚔️ Combat',
      'OPENED': '🚪 Interaction',
      'READ': '📖 Reading',
      'SCENE': '🗺️ Travel',
      'CHECK': '🔍 Examine',
      'USED': '🔧 Action',
      'INTERACTED': '💬 Interaction',
      'EQUIP-ERROR': '❌ Error',
      'NOT-FOUND': '❌ Error',
      'DENIED': '🚫 Blocked',
      'VISIBILITY': '👻 Stealth',
      'AP': '⚡ Action Points',
      'WEARING': '🛡️ Armor',
      'STRIP': '👕 Armor',
      'COOLDOWN': '⏰ Cooldown',
      'ACTIVATION': '✨ Skill',
      'LOST': '💸 Loss'
    };

    return titles[category] || '📋 Game';
  }
}