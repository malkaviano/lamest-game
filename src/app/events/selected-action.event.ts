export class SelectedActionEvent {
  constructor(
    public readonly actionId: string,
    public readonly interactiveId: string
  ) {}
}
