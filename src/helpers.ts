import { ParamsFromPath } from './types';
import { URISchema } from './URISchema';

export type GetURISchemaParams<Schema> = Schema extends URISchema<infer Param> ? Param : never;

export type GetURISchemaParamKeys<Schema> = keyof GetURISchemaParams<Schema>;

const pathTrimRegExp = /\/{1,}/g;

export function pathJoin(...parts: string[]) {
  return parts.join('/').replace(pathTrimRegExp, '/');
}

const pathTokenRegExp = /:([^\/]+)/g;

export function createPathParamKeys(path: string) {
  let match: RegExpExecArray | null;
  const pathParams: string[] = [];
  while ((match = pathTokenRegExp.exec(path))) {
    if (match[1]) {
      pathParams.push(match[1]);
    }
  }
  return pathParams;
}

export function compilePathParam<Path extends string, Params extends ParamsFromPath<Path>>(path: Path, params: Params) {
  return path.replace(pathTokenRegExp, (_, name: keyof Params) => {
    if (!params[name]) {
      throw new Error(`params["${name}"] is not exists in your path params`);
    }
    return String(params[name]);
  });
}

export function createPathParamRegexp(path: string) {
  return new RegExp(`^${path.replace(pathTokenRegExp, (_, name) => `(?<${name}>.*?)`)}$`);
}
