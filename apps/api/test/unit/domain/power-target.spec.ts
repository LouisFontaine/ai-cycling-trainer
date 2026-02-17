import { PowerTarget } from '@domain/value-objects/power-target.vo';

describe('PowerTarget', () => {
  describe('fixed()', () => {
    it('should create a fixed power target with correct value', () => {
      const target = PowerTarget.fixed(95);

      expect(target.value).toBe(95);
      expect(target.start).toBeUndefined();
      expect(target.end).toBeUndefined();
      expect(target.isRamp).toBe(false);
    });
  });

  describe('range()', () => {
    it('should create a range with average value', () => {
      const target = PowerTarget.range(88, 94);

      expect(target.value).toBe(91);
      expect(target.start).toBe(88);
      expect(target.end).toBe(94);
      expect(target.isRamp).toBe(false);
    });

    it('should round average to nearest integer', () => {
      const target = PowerTarget.range(50, 75);

      expect(target.value).toBe(63);
    });
  });

  describe('ramp()', () => {
    it('should create an ascending ramp', () => {
      const target = PowerTarget.ramp(50, 90);

      expect(target.value).toBe(70);
      expect(target.start).toBe(50);
      expect(target.end).toBe(90);
      expect(target.isRamp).toBe(true);
      expect(target.isAscending).toBe(true);
    });

    it('should create a descending ramp', () => {
      const target = PowerTarget.ramp(90, 50);

      expect(target.isRamp).toBe(true);
      expect(target.isAscending).toBe(false);
    });
  });

  describe('isAscending', () => {
    it('should return false for fixed target', () => {
      const target = PowerTarget.fixed(80);

      expect(target.isAscending).toBe(false);
    });
  });
});
