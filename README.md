# uri-manager

URI serialize and match data use `path-to-regexp` and use safety type!

## Example

```ts
import { URISchema } from 'uri-manager';

const productList = new URISchema<{ search?: string; }>('/product');
const productDetail = new URISchema('/product/:productId(\\d+)');

// serialize
productList.serialize(); // "/product"
productList.serialize({ search: 'keyword' }); // "/product?search=keyword"
productDetail.serailize({ productId: 10 }); // "product/10"

// match
productDetail.match('/foo/bar'); // null
productDetail.match('/product/15'); // { productId: 15 }
```

## Features

### Automatic type check from path!

```ts
import { URISchema } from 'uri-manager';

const filter = new URISchema('/filter/:category?');

filter.serialize(); // ✅ "/filter"
filter.serialize({ category: 'foo' }); // ✅ "/filter/foo"

const productDetail = new URISchema('/product/:productId(\\d+)');

productDetail.serialize(); // ❎ TypeError: Expected 1 arguments, but got 0.
productDetail.serialize({ productId: 'foo' }); // ❎ TypeError: Type 'string' is not assignable to type 'number'
productDetail.serialize({ productId: 10 }); // ✅ "/product/10"
```

### Manually definition type with query string

```ts
import { URISchema, ParamsFromPath } from 'uri-manager';

const productList = new URISchema<{ search?: string; }>('/product');

productList.serialize(); // ✅ "/product"
productList.serialize({ search: 'foo' }); // ✅ "/product?search=foo"

const productDetail = new URISchema<ParamsFromPath<'/product/:productId(\\d+)'> & { tag: string }>('/product/:productId(\\d+)');

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

```tsx
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { URISchema, GetURISchemaParams } from 'uri-manager';

const productDetailRoute = new URISchema('/product/:productId(\\d+)');

const ProductDetail = () => {
  const match = useRouteMatch<GetURISchemaParams<typeof productDetailRoute>>();
  return (
    <h1>Product detail id : {match?.params.productId}</h1>
  );
};

const App = () => {
  return (
    <Switch>
      <Route path={productDetailRoute.template} component={ProductDetail} />
    </Switch>
  )
};
```
