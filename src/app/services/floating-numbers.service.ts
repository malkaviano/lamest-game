import { Injectable, ComponentRef, ViewContainerRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { FloatingNumberWidgetComponent, FloatingNumberData } from '../widgets/floating-number/floating-number.widget.component';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

@Injectable({
  providedIn: 'root'
})
export class FloatingNumbersService {
  private viewContainer?: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public setViewContainer(viewContainer: ViewContainerRef): void {
    this.viewContainer = viewContainer;
  }

  public showFloatingNumber(
    data: FloatingNumberData, 
    x: number, 
    y: number
  ): void {
    if (!this.viewContainer) {
      console.warn('ViewContainer not set for FloatingNumbersService');
      return;
    }

    const factory: ComponentFactory<FloatingNumberWidgetComponent> = 
      this.componentFactoryResolver.resolveComponentFactory(FloatingNumberWidgetComponent);
    
    const componentRef: ComponentRef<FloatingNumberWidgetComponent> = 
      this.viewContainer.createComponent(factory);

    componentRef.instance.data = data;
    componentRef.instance.startX = x;
    componentRef.instance.startY = y;
  }

  public showDamage(damage: number, x: number, y: number, effectType?: EffectTypeLiteral, crit?: boolean): void {
    this.showFloatingNumber({
      value: damage,
      type: 'damage',
      effectType,
      crit
    }, x, y);
  }

  public showHealing(healing: number, x: number, y: number): void {
    this.showFloatingNumber({
      value: healing,
      type: 'heal'
    }, x, y);
  }

  public showExperience(exp: number, x: number, y: number): void {
    this.showFloatingNumber({
      value: exp,
      type: 'experience'
    }, x, y);
  }

  public showInfo(value: number, x: number, y: number): void {
    this.showFloatingNumber({
      value: value,
      type: 'info'
    }, x, y);
  }

  public showText(label: string, x: number, y: number): void {
    this.showFloatingNumber({
      type: 'text',
      label
    }, x, y);
  }
}
