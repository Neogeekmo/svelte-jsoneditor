<svelte:options immutable={true} />

<script lang="ts">
  import type { JSONPath } from 'immutable-json-patch'
  import { compileJSONPointer } from 'immutable-json-patch'
  import { getValueClass } from '$lib/plugins/value/components/utils/getValueClass.js'
  import { type JSONParser, type JSONSelection, Mode, type OnPatch } from '$lib/types.js'
  import { isValueSelection } from '$lib/logic/selection.js'

  export let path: JSONPath
  export let value: unknown
  export let mode: Mode
  export let parser: JSONParser
  export let readOnly: boolean
  export let selection: JSONSelection | undefined
  export let onPatch: OnPatch

  // Options for autocompletion
  export let options: Array<{ value: unknown; text: string }>

  // Bind variables
  let inputValue: string = (value as string) || ''
  let filteredOptions = options
  let showSuggestions = false
  let refInput: HTMLInputElement | undefined

  function applyFocus(selection: JSONSelection | undefined) {
    if (selection && refInput) {
      refInput.focus()
    }
  }
  $: applyFocus(selection)

  function selectOption(option: { value: any; text: any }) {
    inputValue = option.text
    showSuggestions = false
    if (!readOnly) {
      onPatch([
        {
          op: 'replace',
          path: compileJSONPointer(path),
          value: option.value
        }
      ])
    }
  }

  function handleBlur() {
    setTimeout(() => (showSuggestions = false), 200)
  }

  function handleInput() {
    showSuggestions = true
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredOptions.length > 0) {
        selectOption(filteredOptions[0])
      }
    }
  }
</script>

<input
  bind:this={refInput}
  bind:value={inputValue}
  on:input={handleInput}
  on:focus={() => (showSuggestions = true)}
  on:blur={handleBlur}
  on:keydown={handleKeyDown}
  readonly={readOnly}
  list="datalistOptions"
  autocomplete="off"
  class={`jse-autocomplete-value ${getValueClass(inputValue, mode, parser)}`}
  class:jse-selected={isValueSelection(selection)}
/>
{#if showSuggestions && filteredOptions.length > 0}
  <datalist class="jse-autocompletea-suggestions" id="datalistOptions">
    {#each filteredOptions as option}
      <option value={option.value}>{option.text}</option>
      <!-- <li on:click={() => selectOption(option)}>{option.text}</li> -->
    {/each}
  </datalist>
{/if}

<style src="./AutocompleteValue.scss"></style>
