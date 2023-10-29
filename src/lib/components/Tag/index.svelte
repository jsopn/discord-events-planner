<script lang="ts">
  let data: HTMLElement;

  let copyToClickboard = () => {
    if (!data.textContent) return

    navigator.clipboard.writeText(data.textContent);
  }
</script>

<span bind:this={data} on:click={copyToClickboard}>
  {"{"}<slot />{"}"}
</span>

<style lang="scss">
  span {
    background-color: var(--dark-secondary-color);
    padding: 3px;
    border-radius: 5px;

    font-size: 10px;
    font-family: var(--monospace-font-family);

    cursor: pointer;

    transition: all 0.3s ease;
    
    &:hover {
      background-color: #151515;
    }

    &:active {
      background-color: var(--secondary-color);
    }
  }
</style>