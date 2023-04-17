import { ArrayView } from '../../core/view-models/array.view';

export interface ReadableInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
