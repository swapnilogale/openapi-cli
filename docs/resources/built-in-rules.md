---
title: Built-in rules in OpenAPI CLI
redirectFrom:
  - /docs/cli/built-in-rules/
---

# Built-in rules

All of our built-in rules are listed below.
We don't ship any built-in preprocessors.
To change your settings for any given rule, just add or modify a corresponding item in the `rules` section of the `.redocly.yaml` in your working directory.

Each of the `rules` entries can be one of following:
- `rule-name`: `{severity}`, where `{severity}` is on of `error`, `warn` or `off`
- ```yaml
  rule-name:
    severity: {severity}
    rule-option-one: value
    rule-option-two: value
  ```

## List of built in rules

### spec
Validate against the declared OpenAPI specification (currently supports version 2.0, 3.0, and 3.1).

### boolean-parameter-prefixes
`name` fields of Parameters with type `boolean` should have a `is` or `has` prefix.
You can specify different prefixes.
```yaml
lint:
  boolean-parameter-prefixes:
    severity: {severity}
    prefixes: ["can", "is"]
```

### info-contact
Verifies the info contact object is present and correctly structured.

### info-license
Verifies the license is declared.

### info-license-url
Verifies the license URL is declared.

### tag-description
Verifies that each tag has a description.

### tags-alphabetical
Verifies that tags (names) are declared in alphabetical order.

### parameter-description
Verifies that each parameter has a description.

### no-example-value-and-externalValue
Examples for `requestBody` or response examples can have an `externalValue` or a `value`, but they cannot have both.

###  no-server-example.com
Server URL should not point to example.com.

###  no-server-trailing-slash
Server URL should not have a trailing slash.

Some tooling forgets to strip trailing slashes off when it's joined with the `servers.url` with paths, and you can get awkward URLs like `https://example.com/api//pets`.
This rule will remind you to strip them off yourself.

### path-parameters-defined
Verifies the path parameters are defined.

### operation-description
Verifies each operation has a description.

### operation-summary
Verifies each operation has a summary.
Operation summaries are used to generate API docs.

### operation-parameters-unique
Verifies parameters are unique for any given operation.

### no-unresolved-refs
Resolves all refs.

### no-invalid-media-type-examples
Verifies media type examples comply with the defined schema. Disallows additional properties by default.
Adjust that behavior in configuration:

```yaml
lint:
  rules:
    no-invalid-media-type-examples:
      severity: warn
      disallowAdditionalProperties: false
```
### no-empty-servers
Empty servers defaults to localhost.
This rule verifies the servers have been defined.

### no-unused-components
Verifies there are no unused components.
Note, it does not verify there aren't unused files.

### operation-2xx-response
Operation must have at least one `2xx` response.
Any API operation (endpoint) can fail but presumably it is also meant to do something constructive at some point.
If you forget to write out a success case for this API, then this rule will let you know.

### operation-4xx-response
Operation must have at least one `4xx` response.

Any API may return an error. Verifies that every API operation has at least one error case described.

### operation-operationId
Every operation must have an `operationId` defined.
Useful in the docs for deep-linking.
Useful elsewhere by having a common ID to refer to any operation.

### operation-operationId-unique
Every operation must have a unique `operationId`.

Why? A lot of documentation systems use this as an identifier, some SDK generators convert them to a method name, and all sorts of things like that.

### operation-operationId-url-safe
Seeing as `operationId` is often used for unique URLs in documentation systems, it's a good idea to avoid non-URL safe characters.

### operation-security-defined
Operation `security` values must match a scheme defined in the `components.securitySchemes` object.

### operation-singular-tag
Use just one tag for an operation, which is helpful for some documentation systems which use tags to avoid duplicate content.

### operation-tag-defined
Operation tags should be defined in global tags.

### no-enum-type-mismatch
Enum values should respect the type specifier.

### path-declaration-must-exist
Path parameter declarations cannot be empty, ex. `/given/{}`is invalid.

### no-path-trailing-slash
Keep trailing slashes off of paths, as it can cause some confusion.
Some web tooling (like mock servers, real servers, code generators, application frameworks, etc.) will treat `example.com/foo` and `example.com/foo/` as the same thing, but other tooling will not.
Avoid any confusion by just documenting them without the slash, and maybe some tooling will let people shove a / on there when they're using it or maybe not, but at least the docs are suggesting how it should be done properly.

### path-not-include-query
Don't put query string items in the path, they belong in parameters with `in: query`.

### no-path-trailing-slash
Verifies that paths do not end with a trailing slash.

### no-identical-paths
Verifies that paths are not identical including templated paths.

For example, these paths are identical because only the parameter name changed.
```
/pets/{id}
/pets/{hash}
```

### no-ambiguous-paths
Verifies that paths are not ambiguous as defined in the spec:

> Assuming the following paths, the concrete definition, `/pets/mine`, will be matched first if used:
> ```
>   /pets/{petId}
>   /pets/mine
> ```
> The following paths are considered identical and invalid:
> ```
>   /pets/{petId}
>   /pets/{name}
> ```
> The following may lead to ambiguous resolution:
> ```
>   /{entity}/me
>   /books/{id}
> ```

### paths-kebab-case
All path items should be in kebab-case.

### path-segment-plural

All path segments should be plural. You can skip last segment or add exceptions using configuration:

```yaml
lint:
  boolean-parameter-prefixes:
    severity: {severity}
    ignoreLastPathSegment: true
    exceptions:
      - v1
```

### no-http-verbs-in-paths

Prevent HTTP verbs in paths like `GET /getAllCustomers`.
Configure `splitIntoWords` to split path into words using casing before matching:

```yaml
lint:
  no-http-verbs-in-paths:
    severity: {severity}
    splitIntoWords: true
```


### path-excludes-patterns

Disallow specific regular expressions to match against paths.

```yaml
lint:
  path-excludes-patterns:
    severity: error
    patterns:
      - ^\/[a-z]
```

### request-mime-type

Limit the allowed request body mime types. The rule inverses behavior for webhooks and events: it enforces responses mime types.

```yaml
lint:
  request-mime-type:
    severity: error
    allowedValues:
      - application/json
```


### response-mime-type

Limit the allowed response mime types. The rule inverses behavior for webhooks and events: it enforces requests mime types.

```yaml
lint:
  response-mime-type:
    severity: error
    allowedValues:
      - application/json
```

### no-invalid-schema-examples

Verifies that schema example value conforms to the schema. Disallows additional properties by default.

```yaml
lint:
  no-invalid-schema-examples:
    severity: error
    disallowAdditionalProperties: false
```


### no-invalid-parameter-examples

Verifies that parameter example value conforms to the schema. Disallows additional properties by default.

```yaml
lint:
  no-invalid-parameter-examples:
    severity: error
    disallowAdditionalProperties: false
```

## Recommended config

There are three built-in configurations:
- minimal
- recommended
- all

The recommended configuration can be enabled by adding
```yaml
lint:
  extends:
    - recommended
```
in the `.redocly.yaml` file (and it is enabled by default).

You may override any specific rule's severity then in the `rules` section.

Here is the equivalent of the `recommended` configuration values:

```yaml
    info-description: warn
    info-contact: off
    info-license: warn
    info-license-url: warn
    tag-description: warn
    tags-alphabetical: off
    parameter-description: off
    no-path-trailing-slash: error
    no-ambiguous-paths: warn
    path-declaration-must-exist: error
    path-not-include-query: error
    path-parameters-defined: error
    operation-description: off
    operation-2xx-response: warn
    operation-4xx-response: warn
    operation-operationId: warn
    operation-summary: error
    operation-operationId-unique: error
    operation-operationId-url-safe: error
    operation-parameters-unique: error
    operation-tag-defined: off
    operation-security-defined: error
    operation-singular-tag: off
    no-unresolved-refs: error
    no-enum-type-mismatch: error
    boolean-parameter-prefixes: off
    paths-kebab-case: off
    spec: error
    no-invalid-media-type-examples:
      severity: warn
      disallowAdditionalProperties: true
    no-server-example.com: warn
    no-server-trailing-slash: error
    no-empty-servers: error
    no-example-value-and-externalValue: error
    no-unused-components: warn
    no-undefined-server-variable: error
```

## Built-in rule ideas

OpenAPI-cli supports [custom rules](./custom-rules.md).
However, if you have an idea for a built-in rule you believe will benefit the greater API community, please [open an issue](https://github.com/Redocly/openapi-cli/issues/new).

## Generic built-in rules

You can use special `assertions` for cases which our other built-in rules do not cover.
There are [a set of generic built-in rules](#list-of-generic-built-in-rules) which can be configured under `assertions` to enforce different generic usecases.

### How it works?

Let's say you want to validate Operation summary and Info description fields - they should be defined,
30 chars length and both should end with a "_full stop_".
For this usecase you can create next assertion:

```yaml
lint:
  rules:
    assertions:
      - on:
        - Operation.summary
        - Info.description
        description: Operation summary and description fields should be at least 30 characters and end with a full stop.
        severity: error
        defined: true
        minLength: 30
        regex: /(full stop)$/
```

### Format of `assertions`

Basically `assertions` is an array of assertions, where each one has the next fields structure:
- `on` - the path or array of the paths to the properties on which we should do the linting. The path is the string splitted by `.`.
- `description` - optional error message.
- `severity` - the severity level of particular case (`off`, `warn`, `error`). Not required, by default `error`.
- the [list of generic rules](#list-of-generic-built-in-rules) with their options.


## List of generic built-in rules

### enum

To enforce a value to be among set of predefined values.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Summary should be amoung predefined values
        severity: error
        enum:
          - one
          - two
```

This rule also runs on node's keys. It means that the `on` path can end with the `$keys` string.

```yaml
lint:
  rules:
    assertions:
      - on: MediaTypeMap.$keys
        description: Only application/json can be used
        severity: error
        enum:
          - application/json
```

### pattern

To enforce a value to match a regex.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Summary should match a regex
        severity: error
        pattern: /test/
```

### casing

To enforce specific casing style (camelCase, kebab-case, snake_case, PascalCase, MACRO_CASE, COBOL-CASE, flatcase)

```yaml
lint:
  rules:
    assertions:
      - on: Operation.operationId
        description: Operation Id should be camelCase
        severity: error
        casing: camelCase
```

### mutuallyExclusive 

To mark some properties as mutually exclusive (`a` or `b` but not `a` and `b` together).
This rule runs only on node's keys. It means that the `on` path should end with the `$keys` string.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.$keys
        description: Operation should not have summary and security fileds together
        severity: error
        mutuallyExclusive:
          - summary
          - security
```

### mutuallyRequired

To mark some properties as mutually required (`a` and `b` but not only `a` or only `b`).
This rule runs only on node's keys. It means that the `on` path should end with the `$keys` string.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.$keys
        description: Operation should have summary and security fileds together
        severity: error
        mutuallyRequired:
          - summary
          - security
```

### defined

To check if some property is defined. 

```yaml
lint:
  rules:
    assertions:
      - on: Operation.operationId
        description: Operation Id should be defined
        severity: error
        defined: true
```

### undefined

To check if some property is undefined.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Operation summary should be undefined
        severity: error
        undefined: true
```

### nonEmpty

To check if some property is not empty.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Operation summary should not be empty
        severity: error
        nonEmpty: true
```

### length

To enforce length of specific array or string.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Operation summary should have 20 chars length
        severity: error
        length: 20
```

### minLength

To enforce minimal length of specific array or string.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Operation summary should have minimum 20 chars length
        severity: error
        minLength: 20
```

### maxLength

To enforce maximal length of specific array or string.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.summary
        description: Operation summary should have maximum 20 chars length
        severity: error
        maxLength: 20
```

### sortOrder

To enforce sort order in array of strings or array of objects (collection). 
If the `property` fields is present, it means that we check the sort order direction on collection. 
Also, in case of array of strings the direction could be also set like `sortOrder: asc`.

```yaml
lint:
  rules:
    assertions:
      - on: Operation.tags
        description: Tags should be ordered in ASC direction
        severity: error
        sortOrder:
          direction: asc
          property: name
```