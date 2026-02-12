export class Name {
  private constructor(private readonly value: string) {}

  static from(value: string): Name {
    return new Name(value.trim());
  }

  capitalize(): string {
    if (!this.value) return this.value;
    return this.value.charAt(0).toUpperCase() + this.value.slice(1);
  }

  toString(): string {
    return this.value;
  }
}
