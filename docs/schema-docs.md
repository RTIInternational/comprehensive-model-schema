# Schema Documentation

Documents the configuration schema for the CDC's Comprehensive Diabetes Model form.

The config schema is structured with respect to the [react-jsonschema-form library](https://react-jsonschema-form.readthedocs.io/), which follows the [JSON Schema](https://json-schema.org/understanding-json-schema/) format.

## Contents

- [Overview](#overview)
- [Properties](#properties)
  - [Deviations from react-jsonschema-form](#deviations-from-react-jsonschema-form)
- [UI Layout](#ui-layout)
  - [Example](#example)
  - [pages](#pages)
    - [fieldsets](#fieldsets)
    - [Conditional Pages and Fieldsets](#conditional-pages-and-fieldsets)
- [Output](#output)

## Overview

The config schema is used to configure the input fields, validation, conditional fields, layout, and output of a multi-page form.

The step-by-step:

1. Config schema is is retrieved from the API by the client. Select fields are [modified](###-deviations-from-react-jsonschema-form) for use by the form builder.

2. The schema properties are organized into pages, groups, and fieldsets by the ["ui:layout"](##ui-layout) field. Pages and fieldsets whose ["expand_if"](#conditional-pages-and-fieldsets) conditions are not met are prevented from rendering.

3. Individual fieldsets are then rendered by the [react-jsonschema-form library](https://react-jsonschema-form.readthedocs.io/), which builds forms using [schema]() and [ui:schema](). Array and object type schema become fieldsets, and all other types become inputs. The "ui:schema" field describes how its schema should be rendered, including order, field-type, and input-type.

4. On user input, form is validated by schema and conditional fields are update.

5. On submission, the form data is reorgainized into the structure of the config schema's properties for simple back-end validation.

## Properties

The "properties" field of the root level schema should describe all possible fielsets and inputs in the desired output structure.

Each property corresponds the a schema given to the react-jsonschema-form builder, and its "ui:schema" field is given as the uiSchema.

Properties should at minimum include the "title" and "type" fields. "title" will become the heading/label, and "type" will determine the fieldset/input. The exception is in the case of a page with a single fieldset, where the title of the page should be set rather than that of its fieldset.

Properties of type "object" will become fieldsets, and properties of any other type besides "array" will become input fields. "array" type properties may become input fields (such as a multi-select or a series of checkboxes) or fieldsets (such as accordions, tabbed views, or dynamically addable fieldsets) depending on its ui:schema and the type of its items.

See the [JSON Schema](https://json-schema.org/understanding-json-schema/reference/object.html#properties) and [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/) docs for details.

### Deviations from react-jsonschema-form

1. Dynamic arrays must be given "max_items_length" (number) and "items_length" when referenced in "ui:layout". "items_length" should point to the field in "properties" that defines the length.
   - recommended: setting min/max validation on the prop defining the length of the array.
2. ui:schemas for array or object type schemas have an optional "ui:field_type" field.
   - The option for objects is "grid", and the options for arrays are ["accordion" and "tabs"](#accordions-and-tabs).
   - The default is the react-jsonschema-form layout (~~caterpillar~~columnar).
   - Note that the array "items" field is considered an object by the react-jsonschema-form lib.

## UI Layout

JSON Schema is limited to describing the form input and validation, and the react-jsonschema-form library is limited to a single page layout and does not yet include general support for conditional fields. To expand upon these, we have included the "ui:layout" root-level field, which is concerned with organizing the properties into pages and groups and managing conditional logic (including dynamic arrays). It provides a layer of separation between the output data structure and the form layout.

As of now, "ui:layout" only includes the ["pages"](###pages) field.

### Example

The following example is of a two-page form. If the user inputs true for has_dog, then the second page will render asking the user about their dog. The second page has two tabbed panels (groups) labeled "Basic Info" and "Upload a Photo". Possible outputs are below.

```
"properties": {
  "dog_name": { ... },
  "dog_birthdate": { ... },
  "dog_profile_pic": { ... },
  "firstname": { ... },
  "lastname": { ... },
  "has_dog": { ... }
},
"ui:layout": {
  "pages": [
    {
      "url_path": "",
      "build_in_page": {
        "type": "introduction",
        "title": "Doggo?"
      }
    },
    {
      "title": "You",
      "url_path": "/owner-info",
      "fieldsets": [
        { "$ref": "#/properties/firstname" },
        { "$ref": "#/properties/lastname" },
        { "$ref": "#/properties/has_dog" },
      ]
    },
    {
      "title": "Your Dog",
      "url_path": "/doggo-info",
      "expand_if": {
        "has_dog": true
      },
      "group_options": {
        "group_type": "tabs",
        "header_buttons": [
          "Basic Info",
          "Upload a Photo"
        ]
      },
      "fieldsets": [
        [
          { "$ref": "#/properties/dog_name" },
          { "$ref": "#/properties/dog_birthdate" }
        ],
        [
          { "$ref": "#/properties/dog_profile_pic" }
        ]
      ],
    },
  ]
}
```

possible outputs:

```
{
  "dog_name": "Bo",
  "dog_birthdate": {
    "month": 10,
    "day": 9,
    "year": 2008
  },
  "dog_profile_pic": "https://static01.nyt.com/images/2009/04/16/fashion/16dog-600.jpg"
  "firstname": "Barrack",
  "lastname": "Obama",
  "has_dog": "true",
}

{
  "firstname": "Donald",
  "lastname": "Trump",
  "has_dog": false
}
```

### Pages

The "pages" field is an array of objects. For each page, the the "url_path" field is required, the "title" field is recommended, and an "[expand_if]()" condition is optional.

Pages come in two types, schema-generated and built-in.

Schema generated pages must include the ["fieldsets"](#fieldsets) field, which will point to the schema's properties describing the form inputs on that page.

Built in pages must include the "built_in_page" field, which must contain a "type" field. Currently, only types "introduction" and "summary" are available. Optional fields for both include "title", "messange", and "button_text".

#### Fieldsets

The "fieldsets" field of each page is used to assign properties to the page.

"fieldsets" is an array holding either fieldset objects or groups, where each group is simply an array of fieldset objects. fieldset objects are displayed by default as a column, and groups are displayed side-by-side by default, or can be configured as an [accordion or tabbed views](#accordions-and-tabs). Groups cannot be nested.

Each fieldset must include a "\$ref" to a root-level schema property. Option fields include:

- [expand_if]()
- update_on_change: form logic is applied with each change to the input. Required on array fieldsets whose items use the checkboxes ui:widget. Recommended on fields that determine the visibility / length of other fields.
- items_length: (dynamic arrays only; required) a string pointing to the number-type field determining the array's visible length. String is in dot-notation and follows the data structure defined by the config schema's properties, eg. "intervention_sets" or "population.size".
- max_items_length: (dynamic arrays only; required) an integer defining the max number of items addable to the array.

The layout of each fieldset may be defined in the "ui:schema" of its referenced property. All of the react-jsonschema-form options are available, as well as some extended layouts defined [here]().

#### Accordions and Tabs

Groups and array-type fieldsets can both be configured as either an accordion or tabbed view.

To configure a group, the "group_options" field must be added to the groups page object (alongside "fieldsets"), which includes the fields "group_type" and "header_buttons". "group_type" may be either "accordion" or "tabs". "header_buttons" may be either an array containing explicit string values for the heading/tab text or an object with the fields "common_text" and "numbered", where numbered is boolean and common text prefixes the number of each group.

```
  "fieldsets": [
    [ /* group1 */ ],
    [ /* group2 */ ],
    ...
  ]
  "group_options": {
    "group_type": "tabs",
    "header_buttons": [
      "tab 1",
      "tab 2",
      ...
    ]
  }
```

Note that "header_buttons above is equivalent to

```
  "header_buttons": {
    "common_text": "tab",
    "numbered": true
  }
```

To configure a fieldset, the "ui:field_type" ("group_type" equivalent) field must be added to the "ui:schema" of that property and the "header_buttons" field must be added to the "ui:options" of it's "items".

```
"intervention_sets_t1d": {
  "title": "T1D",
  "ui:schema": {
    "ui:field_type": "tabs",
    "ui:options": {
      "orderable": false,
      "addable": false
    },
    "items": {
      "ui:options": {
        "header_buttons": {
          "common_text": "Intervention Set",
          "numbered": true
        }
      },
      "risk_reductions": {
        "ui:field_type": "grid"
      },
      "factor_changes": {
        "ui:field_type": "grid"
      }
    }
  },
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      ...
```

### Conditional Pages and Fieldsets

Defined by the "expand_if" field. Optional on pages and root-level fieldsets.

expand_if points to some fields in the schema's properties and defines a condition. It is structured as an object with one field, which may be either the condition key:value pair or another one-field object, and so on, for example:

```
{
  $ref: #/properties/conditional_property
  expand_if: {
    property_key: {
      sub_prop_key: {
        condition_key: conditiion
      }
    }
  }
}
```

where the output data looks something like

```
{
  property_key: {
    sub_prop_key: {
      condition_key: value
    }
  }
  conditional_property: value
}
```

and the conditional_property input is only rendered when the value of condition_key equals the condition.

# Output

Output is an object structured by the schema's properties.

Fields in conditional pages and fields are only returned if their condition was true at the time of submission.
