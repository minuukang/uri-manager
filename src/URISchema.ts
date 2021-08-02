import { compile, match, MatchFunction, parse, PathFunction, Key as TokenKey } from 'path-to-regexp';

import { ParamsFromPath } from './types';

export type Params = Record<string, string | number> | undefined;

interface URISchemaOptions<T extends string, P extends Params> {
  template?: T;
  baseSchema?: string;
  defaultParams?: Partial<P>;
}

interface URISchemaConstructor {
  new<T extends string, P extends Params = ParamsFromPath<T>>(options: URISchemaOptions<T, P> | T): URISchema<P>;
  new<P extends Params>(options: URISchemaOptions<string, P> | string): URISchema<P>;
}

export interface URISchema<P extends Params> {
  match(path: string): P | null;
  serialize(...[params]: Partial<P> extends P ? [P?] : [P]): string;
}

export const URISchema: URISchemaConstructor = class {
  public readonly template?: string;
  protected readonly baseSchema?: string;
  protected readonly defaultParams?: Partial<Params>;

  protected readonly pathParams?: Record<string, (value: string) => unknown>;
  protected readonly matchFunction?: MatchFunction;
  protected readonly compileFunction?: PathFunction;

  public constructor(options: unknown) {
    if (typeof options === 'string') {
      this.template = options;
    } else if (options && typeof options === 'object') {
      const { template, baseSchema, defaultParams } = options as URISchemaOptions<string, Params>;
      this.template = template;
      this.baseSchema = baseSchema;
      this.defaultParams = defaultParams;
    }
    if (this.template) {
      this.pathParams = parse(this.template)
        .filter((token): token is TokenKey => typeof token !== 'string')
        .reduce((result, token) => {
          return {
            ...result,
            [token.name]: token.pattern.startsWith('\\d') ? Number : String
          };
        }, {});
      this.matchFunction = match(this.template);
      this.compileFunction = compile(this.template);
    }
  }

  public match(path: string) {
    if (!this.matchFunction) {
      throw new Error('pathTemplate is not defined in this URISchema');
    }
    const matchResult = this.matchFunction(path);
    if (matchResult === false) {
      return null;
    }
    return Object.entries(matchResult.params).reduce((result, [key, value]) => {
      return {
        ...result,
        [key]: this.pathParams ? this.pathParams[key]?.(value) : value,
      }
    }, {});
  }

  public serialize(params: Record<string, unknown>) {
    let qs = '';
    let pathParams: Params = undefined;
    if (this.defaultParams || params) {
      const result = Object.entries({ ...this.defaultParams, ...params })
        .filter((param): param is [string, string] => param[1] !== undefined)
        .reduce(
          (result, [key, value]) => {
            if (this.pathParams?.[key]) {
              result.pathParams = { ...result.pathParams, [key]: value } as Params;
            } else {
              result.queryParams = { ...result.queryParams, [key]: value };
            }
            return result;
          },
          {} as {
            pathParams?: Params;
            queryParams?: Record<string, string>;
          }
        );
      qs = result.queryParams ? new URLSearchParams(result.queryParams).toString() : '';
      pathParams = result.pathParams;
    }
    const resultPath = this.compileFunction?.(pathParams) || '/';
    if (this.baseSchema) {
      const url = new URL(resultPath, this.baseSchema);
      url.search = qs;
      return url.toString();
    } else {
      return `${resultPath}${qs ? `?${qs}` : ''}`;
    }
  }
}
