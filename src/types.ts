type Split<Str extends string, Sep extends string> =
  Str extends `${infer Left}${Sep}${infer Right}`
    ? [Left, ...Split<Right, Sep>]
    : [Str];

type ParseTokenValue<Value extends string> = Value extends '\\d+' ? number : Value;

type ParseTokenGroup<Token extends string> =
  Token extends `${infer Name}(${infer Group})`
    ? { name: Name; value: ParseTokenValue<Split<Group, '|'>[number]> }
    : { name: Token; value: string; };

type ParseTokenRequired<Token extends string> =
  Token extends `${infer Name}?`
    ? { required: false } & ParseTokenGroup<Name>
    : { required: true } & ParseTokenGroup<Token>;

type FilterTokenPath<Path extends string> = Path extends `:${infer Token}` ? Token : never;

type GetParamsTokenFromPath<Path extends string> = ParseTokenRequired<FilterTokenPath<Split<Path, '/'>[number]>>;

export type ParamsFromPath<
  Path extends string,
  Tokens extends { name: string; required: boolean; value: unknown; } = GetParamsTokenFromPath<Path>
> =
  & { [key in Extract<Tokens, { required: true }>['name']]: Extract<Tokens, { name: key }>['value'] }
  & { [key in Extract<Tokens, { required: false }>['name']]?: Extract<Tokens, { name: key }>['value'] };
