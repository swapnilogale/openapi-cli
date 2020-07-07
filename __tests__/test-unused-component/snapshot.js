// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`E2E test-unused-component 1`] = `

validating ./openapi.yaml...
[1] openapi.yaml:25:5 at #/components/parameters/anotherParam

Component: "anotherParam" is never used.

23 | components:
24 |   parameters:
25 |     anotherParam:
   |     ^^^^^^^^^^^^
26 |       name: anotherParam
27 |       schema:

Warning was generated by the no-unused-components rule.


[2] openapi.yaml:31:5 at #/components/schemas/Someaa

Component: "Someaa" is never used.

29 |     in: query
30 | schemas:
31 |   Someaa:
   |   ^^^^^^
32 |     type: integer
33 |     enum:

Warning was generated by the no-unused-components rule.


./openapi.yaml: validated in <test>ms

Woohoo! Your OpenAPI definition is valid. 🎉
You have 2 warnings.


`;
