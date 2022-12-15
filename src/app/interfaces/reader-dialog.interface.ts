import { ArrayView } from '../views/array.view';

export interface DocumentOpenedInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
