import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

export interface FloatingNumberData {
  value: number;
  type: 'damage' | 'heal' | 'experience' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-floating-number-widget',
  template: `
    <div #floatingElement 
         class="floating-number"
         [ngClass]="'floating-number--' + data.type">
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
    
    .floating-number--damage {
      color: #ff4444;
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
    
    // Create floating animation
    const tl = gsap.timeline({
      onComplete: () => {
        element.remove();
      }
    });

    tl.to(element, {
      opacity: 1,
      y: -20,
      scale: 1.2,
      duration: 0.1,
      ease: 'back.out(1.7)'
    })
    .to(element, {
      y: -80,
      duration: duration * 0.7,
      ease: 'power2.out'
    })
    .to(element, {
      opacity: 0,
      y: -120,
      duration: duration * 0.3,
      ease: 'power2.in'
    }, '-=0.5');

    // Add random horizontal drift
    gsap.to(element, {
      x: (Math.random() - 0.5) * 50,
      duration: duration,
      ease: 'power1.out'
    });
  }

  public formatValue(): string {
    const value = Math.abs(this.data.value);
    
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
}