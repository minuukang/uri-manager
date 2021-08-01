type Split<Str extends string, Sep extends string> =
  Str extends `${infer Left}${Sep}${infer Right}`
    ? [Left, ...Split<Right, Sep>]
    : [Str];

type ParseTokenValue<Value extends string> = Value extends '\\d+' ? number : Split<Value, '|'>[number];

type ParseTokenGroup<Token extends string> =
  Token extends `${infer Name}(${infer Group})`
    ? { name: Name; value: ParseTokenValue<Group> }
    : { name: Token; value: string; };

type ParseTokenRequired<Token extends string> =
  Token extends `${infer Name}?`
    ? { required: false } & ParseTokenGroup<Name>
    : { required: true } & ParseTokenGroup<Token>;

export type GetParamsTokenFromPath<Path extends string> = {
  [key in Split<Path, '/'>[number]]: key extends `:${infer Token}`
    ? ParseTokenRequired<Token>
    : never;
}[Split<Path, '/'>[number]];

export type ParamsFromPath<
  Path extends string,
  Tokens extends { name: string; required: boolean; value: unknown; } = GetParamsTokenFromPath<Path>
> = Tokens extends never ? never :
  & { [key in Extract<Tokens, { required: true }>['name']]: Extract<Tokens, { name: key }>['value'] }
  & { [key in Extract<Tokens, { required: false }>['name']]?: Extract<Tokens, { name: key }>['value'] };
