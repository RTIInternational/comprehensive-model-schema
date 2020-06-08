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
- [Multi-Variable Validation](#multi-variable-validation)
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

Root level fieldsets may [validate](#multi-variable-validation) across multiple internal fields of type "number" using simple arithmetic comparisons.

See the [JSON Schema](https://json-schema.org/understanding-json-schema/reference/object.html#properties) and [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/) docs for details.

### Deviations from react-jsonschema-form

1. Dynamic arrays must be given "max_items_length" (number) and "items_length" when referenced in "ui:layout". "items_length" should be an integer or should point to the field in "properties" that defines the length.
   - recommended: setting min/max validation on the prop defining the length of the array.
2. ui:schemas for array or object type schemas have an optional "ui:field_type" field.
   - The option for objects is "grid", and the options for arrays are ["accordion" and "tabs"](#accordions-and-tabs).
   - "ui:field_type" may be a string containing the desired field type, or an object for more complex configurations. In the expanded syntax, "type" is a string containing the desired field type (`"ui:field_type": "grid"` is equivalent to `"ui:field_type": { "type": "grid" }`).
   - If "ui:field_type" is not set, the form defaults to the react-jsonschema-form layout (~~caterpillar~~columnar).
   - Note that the array "items" field is considered an object by the react-jsonschema-form lib.
3. Root level fieldsets may have a ["validation" field](#multi-variable-validation) describing internal field comparison checks.

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
      "built_in_page": {
        "type": "introduction",
        "title": "Doggo?"
      }
    },
    {
      "title": "You",
      "url_path": "/owner-info",
      "form_submit_button": true,
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

The "pages" field is an array of objects. For each page, the the "url_path" field is required, the "title" field is recommended, and the "[expand_if](#conditional-pages-and-fieldsets)" and [form-submit-button](#early-form-submit) conditions are optional.

Pages come in two types, schema-generated and built-in.

Schema generated pages must include the ["fieldsets"](#fieldsets) field, which will point to the schema's properties describing the form inputs on that page.

Built in pages must include the "built_in_page" field, which must contain a "type" field. Currently, only types "introduction" and "summary" are available. Optional fields for both include "title", "messange", and "button_text".

#### Fieldsets

The "fieldsets" field of each page is used to assign properties to the page.

"fieldsets" is an array holding either fieldset objects or groups, where each group is simply an array of fieldset objects. fieldset objects are displayed by default as a column, and groups are displayed side-by-side by default, or can be configured as an [accordion or tabbed views](#accordions-and-tabs). Groups cannot be nested.

Each fieldset must include a "\$ref" to a root-level schema property. Option fields include:

- [expand_if](#conditional-pages-and-fieldsets)
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

#### Grids

Object type fieldsets may be displayed as a grid by setting the "ui:field_type" to "grid".

Grid items have a pre-defined width and wrap responsively by default. To set a fixed number of columns, use the expanded syntax instead:

```
// grid with 3 columns regardless of display width
"ui:field_type": {
  "type": "grid",
  "columns": 3
}
```

#### Early Form Submit

The form can be configured to display its submit button on any non-built-in page with the "form_submit_button" page field (see [ui:layout example](#example)). It can be given a string value for use as the button text, but if given `true` will default to "Submit Form".

### Simple Conditional Pages and Fieldsets

Defined by the "expand_if" field. Optional on pages and root-level fieldsets.

expand_if conditions point to some fields in the schema's properties and defines a condition. They are structured as an object with one field, which may be either the condition key:value pair or another one-field object, and so on, for example:

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

### Complex Conditional Pages and Fieldsets

The "expand_if" field may also accept the boolean operations AND and OR. AND operations in "expand_if" are denoted by the "$and" key, and have `object` values wherein each key behaves as an "expand_if" conditional or boolean operation. Similarly, OR operations are denoted by "$or". The following example shows the "expand_if" statement for a field that is displayed when schema.diabetes_type is "t1d" and schema.interventions_basic_t1d[0].type_generic_t1d[0] is "generic".
```
"expand_if": {
  "$and": {
      "diabetes_type": "t1d",
      "interventions_basic_t1d": {
        "0": {
          "type_generic_t1d": {
            "0": "generic"
          }
        }
      }
    },
  }
},
```

Boolean operations may contain any number of operands (zero operands will always resolve to `false`):
```
"expand_if": {
  "$and": {
    "diabetes_type": "t1d",
    "simulation_type_t1d": "Standard"
    "interventions_basic_t1d": {
      "0": {
        "type_generic_t1d": {
          "0": "generic"
        }
      }
    }
  }
},
```

Boolean operations may be nested:
```
"expand_if": {
  "$and": {
    "$or": {
      "diabetes_type": "t1d",
      "simulation_type_t1d": "Standard"
    },
    "interventions_basic_t1d": {
      "0": {
        "type_generic_t1d": {
          "0": "generic"
        }
      }
    }
  }
},
```

# Multi-Variable Validation

This feature allows for sets of numeric fields may need to be compared for validation.

- Root level properties would get new field `"validate"`, which is an array containing objects and or strings.
- Object items in validate contain the string properties `"condition"` and `"error_message"`
- String items define the `"condition"`.
- Each condition is a basic arithmetic equation
  with a single comparative operator <, >, or =,
  with arithmetic operators including `+` or `-`,
  and with terms being either numbers or variables
- Spaces are required between variables, operators, and numbers.
- Operations on either side of the comparative operator are done left to right.
- Numbers and floats are written plainly (eg. 1, 2.63, -5000000, etc.).
- All variables must point to a field of type `number` in the schema.
- Variables are defined relative to the data structure of the root property, where `$` is a placeholder for the root property name.
- Nested properties of are marked by the property name, preceded by the `.` operator.
- Array items are accessed by their index in the same way that object properties are, preceded by a `.`.
- All relations must be confined to a single root-level property.
  ​

## Examples

```
// top-level schema
"properties": {
​
  "object_example": {
    "type": "object",
    "validate": [
      "$.nested_object.field_b + $.nested_object.field_c = $.field_a"
    ]
    "properties": {
​
      "field_a": {
        "type": "number"
        "exclusiveMinimum": 0
      },
​
      "nested_object": {
        "type": "object",
        "properties": {
​
          "field_b": { "type": "number" },
​
          "field_c": { "type": "number" },
​
        }
      }
​
    }
  },
​
  "array_example": {
    "type": "array",
    // all array items are validated in the same way
    "validate": [
      $.0.x > $.0.y",
      $.1.x > $.1.y"
    ]
    "max_items_length": 2
    "items": {
      "type": "object",
      "properties": {
​
        "field_x": { "type": "number" },

        "field_y": { "type": "number" },

      }
    }
  }
}
```

```
// output data example
{
  "object_example": {
    "a": 1,
    "nested_object": {
      "b": 2,
      "c": 3
    }
  },
  "array_example": [
    { "x": 4, "y": 5 },
    { "x": 6, "y": 7 },
  ]
}
​
```

A more complex example might have an output data structure of

```
{
  "root_property": {
    "a": 1,
    "b": 2,
    "nested_object": {
      "c": 3,
      "nested_array: [
        {
          "d": 4,
          "deep_object": {
            "e": 5,
            "f": 1
          }
        },
        {
          "d": 6,
          "deep_object": {
            "e": 7,
            "f": 1
          }
        }
      ]
    }
  }
}
```

with validation on "root_property"

```
validaton: [
  "$.a = $.nested_object.nested_array.0.deep_object.f",
  "$.a = $.nested_object.nested_array.1.deep_object.f"
]
```

# Output

Output is an object structured by the schema's properties.

Fields in conditional pages and fields are only returned if their condition was true at the time of submission.
