import { pathJoin, createPathParamKeys, createPathParamRegexp, compilePathParam } from './helpers';

describe('uri-manager helpers', () => {
  describe('pathJoin()', () => {
    describe('When join two paths', () => {
      it('Should combine slash', () => {
        expect(pathJoin('a/', '/b/', '/c')).toBe('a/b/c');
      });
    });
  });

  describe('createPathParamKeys()', () => {
    describe('When path have not path params', () => {
      it('Should return empty array', () => {
        expect(createPathParamKeys('a/b/c')).toEqual([]);
      });
    });

    describe('When path have path params', () => {
      it('Should return token array', () => {
        expect(createPathParamKeys('/a/:b/c')).toEqual(['b']);
      });
    });
  });

  describe('compilePathParam', () => {
    describe('When path have hot path params', () => {
      it('Should return path normally', () => {
        expect(compilePathParam('a/b/c', {})).toBe('a/b/c');
      });
    });

    describe('When path have path params', () => {
      it('Should replace token path to param data', () => {
        expect(compilePathParam('a/:b/c', { b: 'foo' })).toBe('a/foo/c');
      });
    });
  });

  describe('createPathParamRegexp()', () => {
    describe('When path have hot path params', () => {
      it('Should make regex not have pattern', () => {
        expect(createPathParamRegexp('a/b/c').source).toBe('^a\\/b\\/c$');
      });
    });

    describe('When path have path params', () => {
      it('Should replace token path to regex named group pattern', () => {
        expect(createPathParamRegexp('a/:b/c').source).toBe('^a\\/(?<b>.*?)\\/c$');
      });
    });
  });
});
