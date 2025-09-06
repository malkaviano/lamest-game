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
  ) {
    // Move toast container to feedback panel after a short delay
    setTimeout(() => {
      this.moveToastContainerToFeedbackPanel();
    }, 1000);
  }

  private moveToastContainerToFeedbackPanel(): void {
    const toastContainer = document.querySelector('.toast-container');
    const feedbackContainer = document.getElementById('toast-feedback-container');
    
    if (toastContainer && feedbackContainer) {
      feedbackContainer.appendChild(toastContainer);
      console.log('Toast container moved to feedback panel');
    } else {
      // Try again after a short delay if containers aren't ready
      setTimeout(() => {
        this.moveToastContainerToFeedbackPanel();
      }, 500);
    }
  }

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
    const baseOptions = { 
      positionClass: 'toast-top-center',
      toastClass: 'ngx-toastr custom-toast'
    };

    const configs = {
      // Success actions (green)
      'EQUIPPED': { type: 'success' as const, options: baseOptions },
      'TOOK': { type: 'success' as const, options: baseOptions },
      'CONSUMED': { type: 'success' as const, options: baseOptions },
      'OPENED': { type: 'success' as const, options: baseOptions },
      'READ': { type: 'success' as const, options: baseOptions },
      'USED': { type: 'success' as const, options: baseOptions },
      'INTERACTED': { type: 'success' as const, options: baseOptions },
      'WEARING': { type: 'success' as const, options: baseOptions },
      
      // Error actions (red)
      'DIED': { type: 'error' as const, options: { ...baseOptions, timeOut: 5000 }},
      'EQUIP-ERROR': { type: 'error' as const, options: baseOptions },
      'NOT-FOUND': { type: 'error' as const, options: baseOptions },
      'DENIED': { type: 'error' as const, options: baseOptions },
      'LOST': { type: 'error' as const, options: baseOptions },

      // Warning actions (orange)
      'MISSED': { type: 'warning' as const, options: baseOptions },
      'COOLDOWN': { type: 'warning' as const, options: baseOptions },
      'UNEQUIPPED': { type: 'warning' as const, options: baseOptions },
      'STRIP': { type: 'warning' as const, options: baseOptions },

      // Info actions (blue)
      'CHECK': { type: 'info' as const, options: baseOptions },
      'SCENE': { type: 'info' as const, options: { ...baseOptions, timeOut: 2000 }},
      'AFFECTED': { type: 'info' as const, options: baseOptions },
      'VISIBILITY': { type: 'info' as const, options: baseOptions },
      'AP': { type: 'info' as const, options: baseOptions },
      'ACTIVATION': { type: 'info' as const, options: baseOptions }
    };

    return configs[category] || { type: 'info' as const, options: baseOptions };
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