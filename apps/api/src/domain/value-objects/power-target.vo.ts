export class PowerTarget {
  private constructor(
    private readonly _value: number,
    private readonly _start: number | undefined,
    private readonly _end: number | undefined,
    private readonly _isRamp: boolean,
  ) {}

  static fixed(percent: number): PowerTarget {
    return new PowerTarget(percent, undefined, undefined, false);
  }

  static range(start: number, end: number): PowerTarget {
    return new PowerTarget(Math.round((start + end) / 2), start, end, false);
  }

  static ramp(start: number, end: number): PowerTarget {
    return new PowerTarget(Math.round((start + end) / 2), start, end, true);
  }

  get value(): number {
    return this._value;
  }

  get start(): number | undefined {
    return this._start;
  }

  get end(): number | undefined {
    return this._end;
  }

  get isRamp(): boolean {
    return this._isRamp;
  }

  get isAscending(): boolean {
    if (this._start === undefined || this._end === undefined) return false;
    return this._start < this._end;
  }
}
