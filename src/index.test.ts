import { main } from './index';

describe('Dummy test', () => {
  describe('Test main()', () => {
    it('Should main() return "uri-manager"', () => {
      expect(main()).toBe('uri-manager');
    });
  });
});
