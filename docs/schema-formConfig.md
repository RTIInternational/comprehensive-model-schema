# Schema to formConfig Docs

This document is meant to clarify the API-UI interface for the CDC Diabetes Simulation Models project. 

## Contents
- [General](#general)
- [Building formConfig from Schema](#building-formconfig-from-schema)
    - [Building chapters](#building-chapters)
    - [Building pages](#building-pages)
    - [Separating schema from ui:schema](#separating-schema-from-ui:schema)
    - [Valid schema structures](#valid-schema-structures)
    - [Formatting with ui:schema](#formatting-with-ui:schema)
- [Examples](#examples)

## General
Parameters required by the simulation model are sent to a front end form via JSON schema, and are returned to the API in a JSON schema with corresponding properties.

The schema sent by the RTI API is transformed into a [us-forms-system](https://github.com/usds/us-forms-system) FormApp component via a formConfig object. 
- The schema is formatted in compliance with the [JSON Schema draft 4](http://json-schema.org/draft-04/json-schema-core.html) definitions
- The formConfig is divided into top-level data (the form’s title, the submit url, etc.) and chapters. Each chapter contains a page holding a JSON Schema, as well as a parallel ui:schema of the same shape, which determines the user interface properties of the form.

## Building formConfig from Schema

1) [Building chapters](#building-chapters)
2) [Building pages](#building-pages)
3) [Separating schema from ui:schema](#separating-schema-from-ui:schema)
4) [Valid schema structures](#valid-schema-structures)
    - [inputs](#inputs)
    - [objects (fieldsets)](#objects-(fieldsets))
    - [arrays (duplicable fieldsets)](#arrays-(duplicable-fieldsets))
    - [nested structures](#nested-structures)
5) [Formatting with ui:schema](#formatting-with-ui:schema)

### Building chapters

Chapters are the highest division available in the US Forms System. While they are useful from a UI perspective, they have no importance in the simulation and are not included in the top-level properties of the schema.

The top-level properties of the schema contain a mixture of basic and advance configs that may include their own subproperties. These properties are ordered and divided into different chapters through the following fields at the root level of the schema:
```
  // required
  "ui:chapter:order": ["chapter:basic_setup", "chapter:variables", "chapter:advanced_setup"],
  
  // need at least one chapter
  "chapter:any-chapter-name": {
    "title": "Chapter One"
    "pages": ["page1", "page2", "page3"]
  },
  "chapter:otro-capitulo": {
    "title": "Capítulo Dos"
    "pages": ["página 4"]
  },
  "chapter:別の章": {
    "title": "第三章"
    ["第五章", "第六章"],
  },

  // top-level properties
  "properties": {
    "page1": { /* page object */ },
    "page2": { /* page object */ },
    "page3": { /* page object */ },
    "página4": { /* page object */ },
    "第五章": { /* page object */ },
    "第六章": { /* page object */ },
  }
```

Each chapter must be defined with a display title and a list of pages corresponsing to the top-level properties of the schema.


### Building pages

Each top-level property of the schema must be included in one of the `chapter:` fields, and will be rendered on its own page within that chapter.

Top-level properties follow the JSON Schema format and may be any `type`, but should include `ui:title` for good UX. Top-level properties and the properties nested within them are formatted in the same way for the most part, with a few caveates([`ui:title` handling](#formatting-with-ui:schema), [nested properties](#nested-structures)...).

To have multiple fields under a single page that top-level property must be    `type`ed as either an [object](#objects-(fieldsets)) (fieldset) or an [array](#arrays-(duplicable-fieldsets)) (duplicable fieldsets).

Single field pages are allowed (`type` of `integer`, `enum`, `string`, etc.).

An example top-level property might look like the following:
```
  "ui:chapter:order": ["lonely-chapter"],
  "chapter:lonely-chapter": {
    "title": "Chapter One",
    "pages": ["lonely-page"]
  }
  "properties": {

    /* example top-level-property */
    "lonely-page": {
      "ui:title": "Page One",
      "type": "object",
      "required": [
        "size"
      ],
      "properties": {
      
        // nested property
        "size": {
          "ui:title": "Size"
          "ui:description": "Number of individuals in the population.",
          "type": "integer",
          "minimum": 0
        }
      }
```

Once translated into the formConfig, that page would look like:
```
  chapters: {
    'lonely-chapter': {
      title: 'Chapter One',
      pages: {

        /* corresponding page */
        'lonely-page': {
          path: 'lonely-chapter/lonely-page',
          title: 'Page One',
          uiSchema: {
            size: {
              'ui:title': 'Size',
              'ui:description': 'Number of individuals in the population.'
            },
          },
          schema: {
            type: 'object',
            properties: {
              size: {
                type: 'integer',
                minimum: 0
              },
            },
          },
        },
      },
    },
  },
```

### Valid schema structures
Two different schema may be referred to in this section: the schema sent from RTI and the `schema` prop defining each page. As the formConfig is being built, RTI schema for each page is subdivided into `schema` and `ui:schema`. Details on the `ui:schema` are covered [here](#separating-schema-from-ui:schema).

The page `schema` in the formConfig is always of `type: 'object'`, which accepts the entire top-level property that defines the page.

>This section does not cover everything the US Forms System is capable of doing with JSON Schema. Instead, the goal here is to extend the USFS docs to better cover those areas that directly concern this project. 
>
>JSON Schema's [documentation](ttp://json-schema.org/draft-04/json-schema-core.html) defines the schema, but is not completely covered yet by the US Forms System. The relevant USFS docs are [here](https://github.com/usds/us-forms-system/blob/master/docs/building-a-form/about-the-schema-and-uischema-objects.md)(for general `schema` and `ui:schema` information) and [here](https://github.com/usds/us-forms-system/blob/master/docs/building-a-form/common-patterns-for-building-forms.md#conditionally-hiding-a-group-of-fields)(for validation and condition logic).

#### inputs

Inputs are the lowest level of the form. The common inputs (checkbox, select, text, etc.) are determined by the properties `type`, but [more](https://github.com/usds/us-forms-system/blob/master/docs/building-a-form/available-widgets.md) may be specified by the `ui:widget`.

key props include but are not limited to:
- `'ui:title':` The input's label
- `type:` one of `'string'` | `'number'` | `'integer'` | `'boolean'` ... // TODO: get more of these
- `enum:` (only for select inputs) contains an array of strings and must be paired with `type: 'string'`

#### objects (fieldsets)

Properties of `type: 'object'` may become either pages or fieldsets, but in both cases are defined by their `properties` prop.

- `properties:` an object containing fields and sub-fields
- `'ui:title':` The page name or fieldset title

#### arrays (duplicable fieldsets)

Properties of `type:'array'` become dynamic fieldsets capable of adding and removing elements as needed by the user. These elements are defined by subschema, and may be of any valid `type`. Nested arrays are configured slightly differently than top-level arrays.

The top-level array is defined by it's `items` field, similar to the `properties` of a `type: 'object'`. The `items` field must be of `type: 'object'`, and its `properties` define the elements of the array. The array must also include the field/value pair `'ui:options': { viewField }`.
```
  firstPage: {
    path: 'first-chapter/first-page',
    title: 'Simple Array',
    uiSchema: {
      foo: {
        'ui:options': {
          viewField,
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              thing1: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
```

#### nested structures
Nested `type: 'object'`s simply display as fieldsets, with their `'ui:title'` acting as a heading. `objects` may be nested indefinitely.

In a nested array, the `items` field is moved to `additional-items` and `items` is set to an empty array. `'ui:options': { viewField }` is required at each level of the array.
```
  schema: {
    type: 'object',
    properties: {
      stage: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            stageName: { type: 'string' },
            equation: {
              type: 'array',
              items: [], // array nested in array must have items be []
              additionalItems: {
                // and elements in additionalItems object (formatted as in unnested array)
                type: 'object',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  z: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },
```

### Formatting with ui:schema

A page's `ui:schema` determines anything extraneous to the simulation. In the schema, `ui:` configs are simply prefaced by `ui:` and added to the props of the schema or subschema they're describing.

The `ui:schema` may contain (details [here](https://github.com/usds/us-forms-system/blob/master/docs/building-a-form/about-the-schema-and-uischema-objects.md)):
- `ui:title` -- is automatically reformatted as a `title` prop for top-level properties
- `ui:description`
- `ui:options`
  - `classNames`
  - `widgetClassNames`
  - `viewField`
  - `labels`
  - `nestedContent`
  - `expandUnder`
  - `expandUnderCondition`
  - `expandUnderClassNames`
  - `hideIf`
  - `updateSchema`
- `ui:validations`
- `ui:errorMessages`

### Conditional Fields

[relevant USFS docs](https://github.com/usds/us-forms-system/blob/master/docs/building-a-form/common-patterns-for-building-forms.md#conditionally-hiding-a-group-of-fields)

### Separating schema from `ui:schema`

Because the UI contains information not relevant to the simulation, certain properties (always prefaced by `ui:`) should be included in the schema. These `ui:` configurations in the schema are diverted at the page level into their own `ui:schema` in the formConfig, which mirrors the `schema` for that page. 


## Examples

### Valid schema
// in progress

### Valid formConfig
```
const referenceFormConfig = {
  title: 'CDC Diabetes',
  subTitle: 'sim',
  formId: '',
  urlPrefix: '/',
  trackingPrefix: 'form-',
  transformForSubmit: '',
  submitUrl: '',
  introduction: Introduction,
  confirmation: '',
  defaultDefinitions: {},
  chapters: {
    firstChapter: {
      title: 'First Chapter',
      pages: {
        firstPage: {
          path: 'first-chapter/first-page',
          title: 'Simple Array',
          uiSchema: {
            foo: {
              'ui:options': {
                viewField,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              foo: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    thing1: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
        secondPage: {
          path: 'first-chapter/second-page',
          title: 'Two Fieldsets',
          uiSchema: {
            thing1: {
              //title of sub-section won't show without setting ui:title
              'ui:title': 'thing 1',
            },
            thing2: {
              'ui:title': 'thing 2',
            },
          },
          schema: {
            type: 'object',
            properties: {
              thing1: {
                type: 'object',
                properties: {
                  a: { type: 'number' },
                  b: { type: 'number' },
                  c: { type: 'number' },
                },
              },
              thing2: {
                type: 'object',
                properties: {
                  h: { type: 'number' },
                  i: { type: 'number' },
                  j: { type: 'number' },
                },
              },
            },
          },
        },
        thirdPage: {
          path: 'first-chapter/third-page',
          title: 'Nested Array',
          uiSchema: {
            stage: {
              'ui:options': {
                viewField,
              },
              items: {
                equation: {
                  'ui:options': {
                    viewField,
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              stage: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    stageName: { type: 'string' },
                    equation: {
                      type: 'array',
                      items: [], // array nested in array must have items be []
                      additionalItems: {
                        // and elements in additionalItems object (formatted as in unnested array)
                        type: 'object',
                        properties: {
                          x: { type: 'number' },
                          y: { type: 'number' },
                          z: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    secondChapter: {
      title: 'Second Chapter',
      pages: {},
    },
  },
}
```