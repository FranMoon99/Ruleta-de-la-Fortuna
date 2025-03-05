
import { calculatePrizeIndex, generateRandomAngle } from '../prizes';

describe('Prize Utility Functions', () => {
  describe('calculatePrizeIndex', () => {
    it('should correctly calculate prize index for a given angle and segment count', () => {
      // For a wheel with 12 segments (30 degrees each)
      expect(calculatePrizeIndex(0, 12)).toBe(11);
      expect(calculatePrizeIndex(30, 12)).toBe(10);
      expect(calculatePrizeIndex(60, 12)).toBe(9);
      expect(calculatePrizeIndex(90, 12)).toBe(8);
      expect(calculatePrizeIndex(360, 12)).toBe(11); // 360 is the same as 0
    });
    
    it('should handle large angles by normalizing them', () => {
      expect(calculatePrizeIndex(720, 12)).toBe(11); // 720 is 2 full rotations
      expect(calculatePrizeIndex(750, 12)).toBe(10); // 750 is 2 full rotations + 30
    });
  });
  
  describe('generateRandomAngle', () => {
    it('should generate angles within the expected range', () => {
      // The function adds multiple rotations (at least 3)
      const angle = generateRandomAngle(12);
      expect(angle).toBeGreaterThanOrEqual(360 * 3); // At least 3 rotations
      expect(angle).toBeLessThanOrEqual(360 * 7); // At most 7 rotations
    });
    
    it('should generate different angles on subsequent calls', () => {
      const angle1 = generateRandomAngle(12);
      const angle2 = generateRandomAngle(12);
      expect(angle1).not.toEqual(angle2);
    });
  });
});
