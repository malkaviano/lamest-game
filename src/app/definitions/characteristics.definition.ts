import { Characteristic } from './characteristic.definition';

export class Characteristics {
  constructor(
    public readonly str: Characteristic,
    public readonly con: Characteristic,
    public readonly siz: Characteristic,
    public readonly dex: Characteristic,
    public readonly int: Characteristic,
    public readonly pow: Characteristic,
    public readonly app: Characteristic
  ) {}
}
