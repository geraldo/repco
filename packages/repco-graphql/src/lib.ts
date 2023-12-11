import PgManyToManyPlugin from '@graphile-contrib/pg-many-to-many'
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import pg from 'pg'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'
import { Client } from '@elastic/elasticsearch'
import { mergeSchemas } from '@graphql-tools/schema'
import { NodePlugin } from 'graphile-build'
import {
  GraphQLObjectType,
  GraphQLSchema,
  lexicographicSortSchema,
} from 'graphql'
import { elasticApiFieldConfig } from 'graphql-compose-elasticsearch'
import { createPostGraphileSchema, postgraphile } from 'postgraphile'
import ContentItemFilterPlugin from './plugins/content-item-filter.js'
import ExportSchemaPlugin from './plugins/export-schema.js'
// Change some inflection rules to better match our schema.
import CustomInflector from './plugins/inflector.js'
// Add custom tags to omit all queries for the relation tables
import CustomTags from './plugins/tags.js'
// Add a resolver wrapper to add default pagination args
import WrapResolversPlugin from './plugins/wrap-resolver.js'

export { getSDL } from './plugins/export-schema.js'

const PG_SCHEMA = 'public'

export function createPoolFromUrl(databaseUrl: string) {
  return new pg.Pool({ connectionString: databaseUrl })
}
// Create an GraphQL express middleware with Postgraphile
// for a repco database.
export function createGraphqlHandler(databaseUrlOrPool: string | pg.Pool) {
  return postgraphile(databaseUrlOrPool, PG_SCHEMA, getPostGraphileOptions())
}

export async function createGraphQlSchema(databaseUrl: string) {
  const schema = await createPostGraphileSchema(
    databaseUrl,
    PG_SCHEMA,
    getPostGraphileOptions(),
  )
  const schemaElastic = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        elastic: elasticApiFieldConfig(
          new Client({
            node: 'http://localhost:9200',
            auth: {
              username: 'elastic',
              password: 'repco',
            },
          }),
        ),
      },
    }),
  })

  const mergedSchema = mergeSchemas({
    schemas: [schema, schemaElastic],
  })

  const sorted = lexicographicSortSchema(schema)
  return sorted
}

export function getPostGraphileOptions() {
  return {
    graphiql: true,
    enhanceGraphiql: true,
    disableDefaultMutations: true,
    // classicIds: true,
    setofFunctionsContainNulls: false,
    skipPlugins: [NodePlugin],
    appendPlugins: [
      CustomTags,
      ConnectionFilterPlugin,
      PgManyToManyPlugin,
      SimplifyInflectorPlugin,
      CustomInflector,
      WrapResolversPlugin,
      ExportSchemaPlugin,
      ContentItemFilterPlugin,
      // CustomFilterPlugin,
    ],
    dynamicJson: true,
    graphileBuildOptions: {
      // https://github.com/graphile-contrib/postgraphile-plugin-connection-filter#performance-and-security
      connectionFilterComputedColumns: true,
      connectionFilterSetofFunctions: false,
      connectionFilterLists: false,
      connectionFilterRelations: true,
    },
    watchPg: true,
    disableQueryLog: process.env.NODE_ENV !== 'development',
    // pgDefaultRole:
    //   process.env.NODE_ENV === 'development' ? 'graphql' : 'viewer',
  }
}
