type Split<Str extends string, Sep extends string> =
  Str extends `${infer Left}${Sep}${infer Right}`
    ? [Left, ...Split<Right, Sep>]
    : [Str];

type GetParamsTokenFromPath<Path extends string> = {
  [key in Split<Path, '/'>[number]]: key extends `:${infer Token}`
    ? Token
    : never;
}[Split<Path, '/'>[number]];

export type ParamsFromPath<
  Path extends string,
> = { [key in GetParamsTokenFromPath<Path>]: string }
