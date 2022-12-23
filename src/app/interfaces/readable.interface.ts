import { ArrayView } from '../views/array.view';

export interface ReadableInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
