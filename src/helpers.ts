import { URISchema } from './URISchema';

export type GetURISchemaParams<Schema> = Schema extends URISchema<infer Param> ? Param : never
