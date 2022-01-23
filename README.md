# uri-manager

URI serialize and match data, use safety type!
Successfully integration to (react-router-v6)[https://reactrouter.com/docs/en/v6]!

## Example

```ts
import { URISchema } from 'uri-manager';

const product = new URISchema('/product');
const productList = product.createSubPath<{ search?: string; }>('/list');
const productDetail = product.createSubPath('/product/:productId');

// serialize
productList.serialize(); // "/product"
productList.serialize({ search: 'keyword' }); // "/product?search=keyword"
productDetail.serailize({ productId: '10' }); // "product/10"

// match
productDetail.match('/foo/bar'); // null
productDetail.match('/product/15'); // { productId: 15 }

// deep sub path serialize
const media = new URISchema('/media');
const mediaDetail = media.createSubPath('/:mediaId');
const mediaDetailComments = mediaDetail.createSubPath('/comments');
const mediaDetailCommentDetail = mediaDetailComments.createSubPath('/:commentId');

media.serialize(); // "/media"
mediaDetail.serialize({ mediaId: '10' }); // "/media/10"
mediaDetailComments.serialize({ mediaId: '15' }); // "/media/15/comments"
mediaDetailCommentDetail.serialize({ mediaId: '20', commentId: '25' }); // "/media/20/comments/25"
```

## Features

### Manually definition type with query string

```ts
import { URISchema, ParamsFromPath } from 'uri-manager';

const productList = new URISchema<{ search?: string; }>('/product');

productList.serialize(); // ✅ "/product"
productList.serialize({ search: 'foo' }); // ✅ "/product?search=foo"

const productDetail = new URISchema<ParamsFromPath<'/product/:productId'> & { tag: string }>('/product/:productId(\\d+)');

productDetail.serialize({ productId: 10, tag: 'bar' }); // ✅ "/product/10?tag=bar"
```

### Using `defaultParams` to setting params

```ts
import { URISchema } from 'uri-manager';

const filter = new URISchema({
  template: '/filter/:category?',
  defaultParams: {
    category: 'ALL'
  }
});

filter.serialize(); // ✅ "/filter/ALL"
filter.serialize({ category: 'FEATURES' }); // ✅ "/filter/FEATURES"
```

### Using `baseSchema` to create app schema

```ts
import { URISchema } from 'uri-manager';

const viewSchema = new URISchema<{ view: string }>({ baseSchema: 'weverseshop://weverseshop.benx.co' });

viewSchema.serialize({ view: 'noticeDetail' }); // ✅ "weverseshop://weverseshop.benx.co/?view=noticeDetail"
```

### Integration with `react-router`

This version(v1.0.0) is integration to (react-router-v6)[https://reactrouter.com/docs/en/v6]

```tsx
import React from 'react';
import { Route, Routes, useParams, Outlet } from 'react-router';
import { URISchema, GetURISchemaParamKeys } from 'uri-manager';

const product = new URISchema('/product');
const productDetailRoute = product.createSubPath('/product/:productId');

const ProductDetail = () => {
  const { productId } = useParams<GetURISchemaParamKeys<typeof productDetailRoute>>();
  return (
    <h1>Product detail id : {productId}</h1>
  );
};

declare function ProductLayout(): React.FC;
declare function ProductList(): React.FC;

const App = () => {
  return (
    <Routes>
      <Route path={product.relativePath} element={
        <ProductLayout>
          <Outlet />
        </ProductLayout>
      }>
        <Route index element={<ProductList />} />
        <Route path={productDetailRoute.relativePath} element={<ProductDetail />} />
      </Route>
    </Routes>
  )
};
```
