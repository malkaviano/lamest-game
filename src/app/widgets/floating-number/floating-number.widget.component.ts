import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

export interface FloatingNumberData {
  value?: number;
  type: 'damage' | 'heal' | 'experience' | 'info' | 'text';
  duration?: number;
  effectType?: EffectTypeLiteral; // used to colorize damage types
  label?: string; // used when type is 'text'
  crit?: boolean; // critical variant for damage
}

@Component({
  selector: 'app-floating-number-widget',
  template: `
    <div #floatingElement 
         class="floating-number"
         [ngClass]="classes()">
      {{ formatValue() }}
    </div>
  `,
  styles: [`
    .floating-number {
      position: absolute;
      font-weight: bold;
      font-size: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
    }
    
    .floating-number--text {
      color: #b0bec5;
      font-weight: 600;
    }
    .floating-number--damage {
      color: #ff4444;
    }
    /* Damage subtypes override the generic damage color */
    .floating-number--kinetic {
      color: #ffffff;
    }
    .floating-number--fire {
      color: #ff6b00;
    }
    .floating-number--acid {
      color: #66ff66;
    }
    .floating-number--profane {
      color: #b084f5;
    }
    .floating-number--sacred {
      color: #ffd700;
    }
    
    .floating-number--heal {
      color: #44ff44;
    }
    
    .floating-number--experience {
      color: #ffdd44;
    }
    
    .floating-number--info {
      color: #4444ff;
    }

    /* Crit variant: bigger and slight emphasis */
    .floating-number--crit {
      font-size: 2rem;
      text-shadow: 2px 2px 8px rgba(255, 193, 7, 0.9);
    }
  `]
})
export class FloatingNumberWidgetComponent implements OnInit, AfterViewInit {
  @Input() data!: FloatingNumberData;
  @Input() startX: number = 0;
  @Input() startY: number = 0;
  
  @ViewChild('floatingElement', { static: true }) 
  floatingElement!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    // Position the element at the starting coordinates
    const element = this.floatingElement.nativeElement;
    element.style.left = this.startX + 'px';
    element.style.top = this.startY + 'px';
  }

  ngAfterViewInit(): void {
    this.animateFloating();
  }

  private animateFloating(): void {
    const element = this.floatingElement.nativeElement;
    const duration = this.data.duration || 2;
    const isCrit = !!this.data.crit;
    
    // Create floating animation
    const tl = gsap.timeline({
      onComplete: () => {
        element.remove();
      }
    });

    tl.to(element, {
      opacity: 1,
      y: -20,
      scale: isCrit ? 1.35 : 1.2,
      duration: 0.1,
      ease: 'back.out(1.7)'
    })
    .to(element, {
      y: isCrit ? -100 : -80,
      duration: duration * 0.7,
      ease: 'power2.out'
    })
    .to(element, {
      opacity: 0,
      y: isCrit ? -150 : -120,
      duration: duration * 0.3,
      ease: 'power2.in'
    }, '-=0.5');

    // Add random horizontal drift
    gsap.to(element, {
      x: (Math.random() - 0.5) * 50,
      duration: duration,
      ease: 'power1.out'
    });

    // Add a light shake for CRIT
    if (isCrit) {
      gsap.to(element, {
        rotation: 2,
        yoyo: true,
        repeat: 5,
        duration: 0.06,
        ease: 'sine.inOut'
      });
    }
  }

  public formatValue(): string {
    if (this.data.type === 'text' && this.data.label) {
      return this.data.label;
    }
    const value = Math.abs(this.data.value ?? 0);
    
    switch (this.data.type) {
      case 'damage':
        return `-${value}`;
      case 'heal':
        return `+${value}`;
      case 'experience':
        return `+${value} XP`;
      case 'info':
        return `${value}`;
      default:
        return `${value}`;
    }
  }

  public classes(): string[] {
    const base = `floating-number--${this.data.type}`;
    const subtype = this.data.type === 'damage' && this.data.effectType
      ? `floating-number--${this.data.effectType.toLowerCase()}`
      : '';
    const crit = this.data.type === 'damage' && this.data.crit ? 'floating-number--crit' : '';
    const arr = ['floating-number', base];
    if (subtype) arr.push(subtype);
    if (crit) arr.push(crit);
    return arr;
  }
}
