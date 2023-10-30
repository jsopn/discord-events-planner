<script lang="ts">
  let inputGroup: HTMLDivElement
  export let error = ''

  const checkForError = () => {
    if (!inputGroup) return
    
    const inputs = inputGroup.getElementsByTagName('input')
    if (inputs.length === 0) return

    if (error) return inputs[0].classList.add('input-error') 
    return inputs[0].classList.remove('input-error')
  }

  $: inputGroup, error, checkForError()
</script>

<div class="input-group" bind:this={inputGroup}>
  <slot />

  {#if error}
    <small class="error-message">
      {error}
    </small>
  {/if}
</div>

<style lang="scss">
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .input-group > :global(small) {
    color: var(--secondary-color);
    font-size: 13px;
  }

  .error-message {
    color: #FF6969 !important;
  }
  
  :global(input), :global(textarea), :global(button) {
    color: var(--foreground-color);
    border: 0;
    background-color: var(--dark-secondary-color);
    border-radius: 5px;

    padding: 10px;
    box-sizing: border-box;
    outline: none;

    font-family: var(--font-family);
    font-size: 12px;
    
    &:focus, &:focus{
      box-shadow: none;
      outline: 1px solid var(--secondary-color);
    }
  }

  :global(.input-error) {
    outline: #FF6969 1px solid;

    &:focus, &:focus{
      box-shadow: none;
      outline: 1px #faa6a6 solid;
    }
  }
</style>