export class HitPointsEvent {
  constructor(
    public readonly previous: number,
    public readonly current: number
  ) {}
}
