import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';

@Injectable()
export class WithSubscriptionHelper {
  private subscriptions: Subscription[];

  constructor() {
    this.subscriptions = [];
  }

  public addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  public addSubscriptions(subscriptions: Subscription[]) {
    subscriptions.forEach((s) => this.subscriptions.push(s));
  }

  public unsubscribeAll(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
