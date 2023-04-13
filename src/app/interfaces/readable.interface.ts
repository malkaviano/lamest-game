import { ArrayView } from '../view-models/array.view';

export interface ReadableInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
