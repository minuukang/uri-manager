import { URISchema } from './URISchema';

describe('new URISchema', () => {
  describe('When the rule of uri params is not defined', () => {
    let rule: URISchema<never>;
    beforeEach(() => {
      rule = new URISchema('/home');
    });

    it('Should serialize return the pathTemplate', () => {
      expect(rule.serialize()).toBe('/home');
    });

    it('Should match return empty object when param is equal then pathTemplate', () => {
      expect(rule.match('/home')).toEqual({});
    });

    it('Should match return null when param is not equal then pathTemplate', () => {
      expect(rule.match('/hoome')).toBe(null);
    });
  });

  describe('When the rule of uri params is defined', () => {
    describe('When the rule of uri params is only path params', () => {
      let rule: URISchema<{ id: string }>;
      beforeEach(() => {
        rule = new URISchema('/video/:id');
      });

      it('Should serialize return with param id', () => {
        expect(rule.serialize({ id: '10' })).toBe('/video/10');
      });

      it('Should match return id object when param is equal then pathTemplate', () => {
        expect(rule.match('/video/10')).toEqual({ id: '10' });
      });

      it('Should match return null when param is not equal then pathTemplate', () => {
        expect(rule.match('/video-zzhang/10')).toEqual(null);
      });
    });

    describe('When the rule of uri params is only query params', () => {
      let rule: URISchema<{ app?: string }>;
      beforeEach(() => {
        rule = new URISchema('/web');
      });

      it('Should serialize return pathTemplate with query string app', () => {
        expect(rule.serialize({ app: 'weverse' })).toBe('/web?app=weverse');
      });

      it('Should serialize return only pathTemplate when params is undefined', () => {
        expect(rule.serialize()).toBe('/web');
      });
    });

    describe('When the of uri params is combine path and query params', () => {
      let rule: URISchema<{ id: string; page?: string }>;
      beforeEach(() => {
        rule = new URISchema('/view/:id');
      });

      it('Should serialize return pathTemplate with path and query string', () => {
        expect(rule.serialize({ id: '15', page: 'after' })).toBe('/view/15?page=after');
      });
    });
  });

  describe('When give baseSchema', () => {
    describe('When pathTemplate is not defined', () => {
      let rule: URISchema<{ view: string }>;
      beforeEach(() => {
        rule = new URISchema({
          baseSchema: 'weverseshop://weverseshop.benx.co'
        });
      });

      it('Should serialize return baseSchema with query string', () => {
        expect(rule.serialize({ view: 'noticeList' })).toBe('weverseshop://weverseshop.benx.co/?view=noticeList');
      });
    });
  });

  describe('When give defaultParams', () => {
    let rule: URISchema<{
      view?: string;
    }>;
    beforeEach(() => {
      rule = new URISchema<{
        view?: string;
      }>({
        baseSchema: 'weverseshop://weverseshop.benx.co',
        defaultParams: { view: 'noticeDetail' }
      });
    });

    it('Should serialize return defaultParams is not defined at param', () => {
      expect(rule.serialize()).toBe('weverseshop://weverseshop.benx.co/?view=noticeDetail');
    });
  });

  describe('When give defaultParams with params', () => {
    let rule: URISchema<{
      view?: string;
      artistId: string;
      shop: string;
      noticeId: string;
    }>;
    beforeEach(() => {
      rule = new URISchema<{
        view?: string;
        artistId: string;
        shop: string;
        noticeId: string;
      }>({
        baseSchema: 'weverseshop://weverseshop.benx.co',
        defaultParams: { view: 'noticeDetail' }
      });
    });

    it('Should serialize return defaultParams is not defined at param', () => {
      expect(rule.serialize({ artistId: '3', shop: 'US', noticeId: '5' })).toBe(
        'weverseshop://weverseshop.benx.co/?view=noticeDetail&artistId=3&shop=US&noticeId=5'
      );
    });
  });

  describe('Test sub path creator', () => {
    const parentRule = new URISchema('/:communityId');
    const subPath1 = parentRule.createSubPath('/media');
    const subPath2 = subPath1.createSubPath('/:mediaId');
    const subPath3 = subPath2.createSubPath<{ bar: string }>('/foo');

    it('Should subPath create full path with parent path', () => {
      expect(subPath1.serialize({ communityId: '1' })).toBe('/1/media');
      expect(subPath2.serialize({ communityId: '1', mediaId: '2' })).toBe('/1/media/2');
      expect(subPath3.serialize({ communityId: '1', mediaId: '2', bar: 'mw' })).toBe('/1/media/2/foo?bar=mw');
    });

    it('Should subPath get relativePath is argument template without trim "/"', () => {
      expect(subPath1.relativePath).toBe('media');
      expect(subPath2.relativePath).toBe(':mediaId');
    });

    it('Should subPath get absolutePath is full template', () => {
      expect(subPath1.absolutePath).toBe('/:communityId/media');
      expect(subPath2.absolutePath).toBe('/:communityId/media/:mediaId');
    });
  });
});
