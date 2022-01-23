import { pathJoin, createPathParamKeys, createPathParamRegexp, compilePathParam } from './helpers';
import { ParamsFromPath } from './types';

export type Params = Record<string, string> | undefined;

interface URISchemaOptions<T extends string, P extends Params> {
  template?: T;
  baseSchema?: string;
  defaultParams?: Partial<P>;
  parentPath?: string;
}

interface URISchemaConstructor {
  new <T extends string, P extends Params = ParamsFromPath<T>>(options: URISchemaOptions<T, P> | T): URISchema<P>;
  new <P extends Params>(options: URISchemaOptions<string, P> | string): URISchema<P>;
}
export interface URISchema<P extends Params> {
  relativePath: string;
  absolutePath: string;
  match(path: string): P | null;
  serialize(...[params]: Partial<P> extends P ? [P?] : [P]): string;
  createSubPath<T extends string, NP extends Params = ParamsFromPath<T>>(
    options: URISchemaOptions<T, P & NP> | T
  ): URISchema<P & NP>;
  createSubPath<NP extends Params>(options: URISchemaOptions<string, P & NP> | string): URISchema<P & NP>;
}

export const URISchema: URISchemaConstructor = class {
  protected readonly template: string = '/';
  protected readonly baseSchema?: string;
  protected readonly defaultParams?: Partial<Params>;
  protected readonly parentPath?: string;

  protected get pathParams() {
    return createPathParamKeys(this.absolutePath);
  }

  protected pathFunction(params: Record<string, string>) {
    return compilePathParam(this.absolutePath, params);
  }

  public get relativePath() {
    return this.template.replace(/^\//, '');
  }

  public get absolutePath() {
    return pathJoin(...([this.parentPath, this.template].filter(Boolean) as string[]));
  }

  public constructor(options: unknown) {
    if (typeof options === 'string') {
      this.template = options;
    } else if (options && typeof options === 'object') {
      const { template, baseSchema, defaultParams, parentPath } = options as URISchemaOptions<string, Params>;
      this.template = template || '/';
      this.baseSchema = baseSchema;
      this.defaultParams = defaultParams;
      this.parentPath = parentPath;
    }
    // Throw error when given *, ?, () (regex)
    if (['*', '?', '('].some(regexChar => this.template.includes(regexChar))) {
      throw new Error('Regex pattern is not supported in this version! (using react router v6)');
    }
  }

  public createSubPath(options: unknown) {
    const newOptions: URISchemaOptions<string, Params> = {};
    if (typeof options === 'string') {
      newOptions.template = options;
    } else {
      Object.assign(newOptions, options);
    }
    newOptions.parentPath = this.absolutePath;
    const schema = new URISchema(newOptions);
    return schema;
  }

  protected get pathRegexp() {
    return createPathParamRegexp(this.absolutePath);
  }

  public match(path: string) {
    const match = path.match(this.pathRegexp);
    if (match == null) {
      return null;
    }
    return match.groups || {};
  }

  public serialize(params: Record<string, unknown>) {
    let qs = '';
    let pathParams: Params = undefined;
    if (this.defaultParams || params) {
      const result = Object.entries({ ...this.defaultParams, ...params })
        .filter((param): param is [string, string] => param[1] !== undefined)
        .reduce(
          (result, [key, value]) => {
            if (this.pathParams.includes(key)) {
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
    const resultPath = pathParams ? this.pathFunction(pathParams) : this.absolutePath;
    if (this.baseSchema) {
      const url = new URL(resultPath, this.baseSchema);
      url.search = qs;
      return url.toString();
    } else {
      return `${resultPath}${qs ? `?${qs}` : ''}`;
    }
  }
};
