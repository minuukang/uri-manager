# uri-manager

URI serialize and match data use `path-to-regexp` and use safety type!

## Example

```ts
import { URISchema } from 'uri-manager';

const productList = new URISchema<{ search?: string; }>('/product');
const productDetail = new URISchema('/product/:id(\\d+)');

// serialize
productList.serialize(); // "/product"
productList.serialize({ search: 'keyword' }); // "/product?search=keyword"
productDetail.serailize({ id: 10 }); // "product/10"

// match
productDetail.match('/foo/bar'); // null
productDetail.match('/product/15'); // 15
```

## Features


