<script lang="ts">
  import Icon from 'svelte-awesome'
  import refresh from 'svelte-awesome/icons/refresh'

  import Tag from '$lib/components/Tag/index.svelte'
  import type { ErrorResponse } from '$lib/server/errors'
  import type { IEvent } from '$lib/server/schemas/event.schema'
  import { fromUint8Array } from 'js-base64'
  import moment from 'moment'

  let files: FileList | undefined
  let loading: boolean = false

  const data: IEvent = {
    token: '',
    guildID: '',
    location: '',
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    startFrom: 1,
    eventsCount: 1
  }

  const handleSend = async () => {
    loading = true;

    try {
      const t = await fetch('/createEvent', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          coverImage: files && files.length > 0 ? `data:${files[0].type};base64,${fromUint8Array(new Uint8Array(await files[0].arrayBuffer()))}` : null,
          startTime: moment(data.startTime, 'HH:mm').toISOString(true),
          endTime: moment(data.endTime, 'HH:mm').toISOString(true),
        })
      })

      // TODO: parse errors and display them next to input group
      
      if (t.status !== 200) {
        const d: ErrorResponse = await t.json()

        return alert(d.errors.map(e => `${e.path}: ${e.message}`).join('\n'))
      }

    } finally {
      loading = false
    }
  }

  const openInviteLink = () => {
    const clientID = prompt('Specify the Application ID from the Discord Developer Portal to generate the link')
    if (!clientID) return

    window.open(`https://discord.com/api/oauth2/authorize?client_id=${clientID}&permissions=17592186044416&scope=bot`, '_blank')
  }
</script>

<main>
  <h1>Discord Events Planner</h1>
  <p>This application is designed to create recurring events for Discord servers that take place every day.</p>
  <hr />

  <form on:submit|preventDefault={handleSend}>
    <div class="input-group">
      <label for="token">Bot Token:</label>
      <input type="password" name="token" required bind:value={data.token}>
      
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <small>a bot token with permissions to create & manage events. it can be created <a href="https://discord.com/developers/applications" target="_blank">here</a>. you can also create a bot invitation link by <a on:click={openInviteLink}>clicking here</a></small>
    </div>

    <div class="input-group">
      <label for="guildID">Guild ID:</label>
      <input type="text" name="guildID" placeholder={'457250278912032790'} required bind:value={data.guildID}>
    </div>

    <div class="input-group">
      <label for="location">Location:</label>
      <input type="text" name="location" placeholder={'"YES?" VRChat World'} required bind:value={data.location}>
    </div>

    <div class="input-group">
      <label for="name">Name:</label>
      <input type="text" name="name" placeholder={'{event_number_ordinal_caps} DAILY VRCHAT!'} required bind:value={data.name}>
      <small>available tags: <Tag>event_number</Tag>, <Tag>event_number_ordinal</Tag> (ex. 1st, 2nd, 3rd), <Tag>event_number_ordinal_caps</Tag> (ex. 1ST, 2ND, 3RD)</small>
    </div>

    <div class="input-group">
      <label for="description">Description:</label>
      <textarea name="description" rows="4" placeholder="DAILY VRCHAT is a public event that lets people..." required bind:value={data.description} />
      <small>available tags: the same as in the name</small>
    </div>

    <div class="input-grid">
      <div class="input-group">
        <label for="startTime">Start time:</label>
        <input type="time" name="startTime" placeholder="21:00" required bind:value={data.startTime}>
      </div>

      <div class="input-group">
        <label for="endTime">End time:</label>
        <input type="time" name="endTime" placeholder="23:00" required bind:value={data.endTime}>
      </div>
    </div>

    <div class="input-group">
      <label for="coverImage">Cover image:</label>
      <input type="file" accept="image/jpeg,image/png,image/gif*" name="coverImage" bind:files={files}>
    </div>

    <div class="input-grid">
      <div class="input-group">
        <label for="startFrom">Number of the next event:</label>
        <input type="number" min="1" name="startFrom" required placeholder="100" bind:value={data.startFrom}>
        <small>the number of the event to start counting from. this is used for the <Tag>event_number</Tag> tag.</small>
      </div>
  
      <div class="input-group">
        <label for="eventsCount">Number of events to create:</label>
        <input type="number" min="1" name="eventsCount" max="100" required placeholder="100" bind:value={data.eventsCount}>
        <small>number of events to be created</small>
      </div>  
    </div>

    {#if loading}
      <div class="events-loader">
        <div class="events-loader__spinner-text">
          <Icon data="{refresh}" spin />
        
          creating events...
        </div>

        <small>this may take some time since Discord has a rate-limit on event creation, just leave this page open while the events are being created</small>
      </div>

    {:else}
      <button type="submit">
        Create events!
      </button>
    {/if}
  </form>
</main>

<style lang="scss">
  main {
    padding: 40px;
    background-color: var(--card-color);
    border-radius: 25px;
    max-width: 500px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .input-group > small {
    color: var(--secondary-color);
    font-size: 13px;
  }

  h1 {
    font-size: 40px;
  }

  @media screen and (max-width: 579px) {
    h1 {
      font-size: 30px;
    }
  }

  a {
    cursor: pointer;
  }

  .events-loader {
    text-align: center;
    margin-top: 5px;

    small {
      color: var(--secondary-color);
    }
  }

  .events-loader__spinner-text {
    display: flex;

    gap: 10px;
    justify-content: center;
    align-items: center;

    margin-bottom: 10px;
  }

  hr {
    margin: 15px 0px;
    border: 1px solid var(--dark-secondary-color);
  }

  .input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  input, textarea, button {
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

  button {
    cursor: pointer;
  }
</style>