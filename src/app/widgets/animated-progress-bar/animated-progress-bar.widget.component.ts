import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

export interface ProgressBarData {
  current: number;
  max: number;
  label: string;
  type: 'hp' | 'ep' | 'ap';
}

@Component({
  selector: 'app-animated-progress-bar-widget',
  template: `
    <div class="progress-bar-container" [ngClass]="'progress-bar-container--' + data.type">
      <div class="progress-bar-label">
        <span class="label-text">{{ data.label }}</span>
        <span class="label-values">{{ data.current }} / {{ data.max }}</span>
      </div>
      <div class="progress-bar-track" #track>
        <div class="progress-bar-fill" 
             #fill
             [ngClass]="'progress-bar-fill--' + data.type">
        </div>
        <div class="progress-bar-shine" #shine></div>
      </div>
    </div>
  `,
  styles: [`
    .progress-bar-container {
      margin: 8px 0;
      font-size: 0.9rem;
    }
    
    .progress-bar-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-weight: bold;
    }
    
    .progress-bar-track {
      position: relative;
      height: 20px;
      background: rgba(0,0,0,0.3);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .progress-bar-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 10px;
      transition: width 0.3s ease;
    }
    
    .progress-bar-fill--hp {
      background: linear-gradient(90deg, #ff4444, #ff6666);
    }
    
    .progress-bar-fill--ep {
      background: linear-gradient(90deg, #4444ff, #6666ff);
    }
    
    .progress-bar-fill--ap {
      background: linear-gradient(90deg, #ffdd44, #ffee66);
    }
    
    .progress-bar-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255,255,255,0.4), 
        transparent
      );
      opacity: 0;
    }
    
    .progress-bar-container--hp .label-text {
      color: #ff6666;
    }
    
    .progress-bar-container--ep .label-text {
      color: #6666ff;
    }
    
    .progress-bar-container--ap .label-text {
      color: #ffee66;
    }
  `]
})
export class AnimatedProgressBarWidgetComponent implements OnChanges, AfterViewInit {
  @Input() data!: ProgressBarData;
  
  @ViewChild('fill', { static: true }) fillElement!: ElementRef<HTMLDivElement>;
  @ViewChild('shine', { static: true }) shineElement!: ElementRef<HTMLDivElement>;
  @ViewChild('track', { static: true }) trackElement!: ElementRef<HTMLDivElement>;
  
  private previousValue: number = 0;
  private isInitialized = false;

  ngAfterViewInit(): void {
    this.isInitialized = true;
    this.updateProgressBar(false); // Initial setup without animation
    this.previousValue = this.data.current;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isInitialized) return;
    
    if (changes['data'] && changes['data'].currentValue) {
      const currentData = changes['data'].currentValue as ProgressBarData;
      const hasValueChanged = this.previousValue !== currentData.current;
      
      if (hasValueChanged) {
        this.updateProgressBar(true);
        this.animateValueChange(this.previousValue, currentData.current);
        this.previousValue = currentData.current;
      }
    }
  }

  private updateProgressBar(animate: boolean): void {
    const percentage = (this.data.current / this.data.max) * 100;
    const fillElement = this.fillElement.nativeElement;
    
    if (animate) {
      gsap.to(fillElement, {
        width: `${percentage}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Add shine effect on change
      this.playShineEffect();
      
      // Pulse effect on critical values
      if (percentage <= 25) {
        this.playPulseEffect();
      }
    } else {
      gsap.set(fillElement, { width: `${percentage}%` });
    }
  }

  private animateValueChange(oldValue: number, newValue: number): void {
    const difference = newValue - oldValue;
    const trackElement = this.trackElement.nativeElement;
    
    if (difference < 0) {
      // Damage taken - shake effect
      gsap.to(trackElement, {
        x: -2,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.out'
      });
    } else if (difference > 0) {
      // Healing - glow effect
      gsap.to(trackElement, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    }
  }

  private playShineEffect(): void {
    const shineElement = this.shineElement.nativeElement;
    
    gsap.timeline()
      .set(shineElement, { opacity: 1, x: '-100%' })
      .to(shineElement, { 
        x: '100%', 
        duration: 0.6, 
        ease: 'power2.out' 
      })
      .to(shineElement, { 
        opacity: 0, 
        duration: 0.1 
      });
  }

  private playPulseEffect(): void {
    const fillElement = this.fillElement.nativeElement;
    
    gsap.to(fillElement, {
      opacity: 0.7,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut'
    });
  }
}