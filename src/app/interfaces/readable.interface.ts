import { ArrayView } from '../model-views/array.view';

export interface ReadableInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
