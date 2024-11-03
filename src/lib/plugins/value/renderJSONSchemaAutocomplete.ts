import AutocompleteValue from './components/AutocompleteValue.svelte'
import { getJSONSchemaAutocompleteOptions, getJSONSchemaEnumOptions } from '$lib/utils/jsonSchemaUtils.js'
import type {
  JSONSchema,
  JSONSchemaDefinitions,
  RenderValueComponentDescription,
  RenderValueProps
} from '$lib/types'

/**
 * Render an AutocompleteValue component using either schema-based autocomplete options or enums.
 *
 * If autocomplete options are available in the schema, they will override enum options.
 *
 * @param {RenderValueProps} props - Standard props passed to the renderer.
 * @param {JSONSchema} schema - The JSON schema where enum or autocomplete options might be defined.
 * @param {JSONSchemaDefinitions} schemaDefinitions - Any additional schema definitions.
 */
export function renderJSONSchemaAutocomplete(
  props: RenderValueProps,
  schema: JSONSchema,
  schemaDefinitions?: JSONSchemaDefinitions
): RenderValueComponentDescription[] | undefined {
  // Check for autocomplete options first; fall back to enum options if none are found
  const autocompleteOptions = getJSONSchemaAutocompleteOptions(schema, schemaDefinitions, props.path)
  const options = autocompleteOptions || getJSONSchemaEnumOptions(schema, schemaDefinitions, props.path)

  if (options) {
    const formattedOptions = options.map((option) => ({
      value: option,
      text: String(option)
    }))

    // Ensure the current value is included in the options list for display consistency
    const optionsWithValue = options.includes(props.value)
      ? formattedOptions
      : [{ value: props.value, text: String(props.value) }].concat(formattedOptions)

    return [
      {
        component: AutocompleteValue,
        props: {
          ...props,
          options: optionsWithValue
        }
      }
    ]
  }

  return undefined
}
