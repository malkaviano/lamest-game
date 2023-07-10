import { ArrayView } from '@wrappers/array.view';

export interface ReadableInterface {
  readonly title: string;
  readonly text: ArrayView<string>;
}
