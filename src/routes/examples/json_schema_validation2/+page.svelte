<script>
  import { JSONEditor, renderValue, renderJSONSchemaAutocomplete } from 'svelte-jsoneditor'

  const schema = {
    title: 'Employee',
    description: 'Object containing employee details',
    type: 'object',
    properties: {
      firstName: {
        title: 'First Name',
        description: 'The given name.',
        examples: ['John'],
        type: 'string'
      },
      lastName: {
        title: 'Last Name',
        description: 'The family name.',
        examples: ['Smith'],
        type: 'string'
      },
      gender: {
        title: 'Gender',
        enum: ['male', 'female']
      },
      availableToHire: {
        type: 'boolean',
        default: false
      },
      age: {
        description: 'Age in years',
        type: 'integer',
        minimum: 0,
        examples: [28, 32]
      },
      job: {
        $ref: 'job'
      }
    },
    required: ['firstName', 'lastName']
  }

  const schemaDefinitions = {
    job: {
      title: 'Job description',
      type: 'object',
      required: ['address'],
      properties: {
        company: {
          type: 'string',
          autocomplete: ['ACME Corp', 'Dexter Industries', 'Freelance'] // Autocomplete options
        },
        role: {
          description: 'Job title.',
          type: 'string',
          autocomplete: ['Developer', 'Manager', 'Human Resources'], // Autocomplete options for role
          default: 'Software Developer'
        },
        address: {
          type: 'string'
        },
        salary: {
          type: 'number',
          minimum: 120,
          examples: [100, 110, 120]
        }
      }
    }
  }

  // Enable rendering with autocomplete and enum support
  function onRenderValue(props) {
    // First try autocomplete options, fallback to enums
    return renderJSONSchemaAutocomplete(props, schema, schemaDefinitions) || renderValue(props)
  }

  let content = {
    text: undefined, // can be used to pass a stringified JSON document instead
    json: {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      age: 28,
      availableToHire: true,
      job: {
        company: 'Freelance',
        role: 'Developer',
        salary: 100
      }
    }
  }
</script>

<svelte:head>
  <title>JSON Schema validation | svelte-jsoneditor</title>
</svelte:head>

<h1>JSON Schema Validation with Autocomplete</h1>

<p>This example demonstrates JSON schema validation with support for autocomplete and enums.</p>

<div class="editor">
  <JSONEditor bind:content {onRenderValue} />
</div>

<style>
  .editor {
    width: 700px;
    height: 400px;
  }
</style>
