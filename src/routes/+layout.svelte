<svelte:head>
  <title>{"< > <"} | Discord Events Planner</title>

  <meta
    name="keywords"
    content="discord events planner, discord, events, recurring events"
  />

  <meta property="og:author" content="jsopn" />
</svelte:head>

<div class="site-content">
  <div class="site-content__inner">
    <slot />
    
    <footer>
      <p>
        <a href="https://github.com/jsopn/discord-events-planner" target="_blank">source code</a> :: <a href="https://jsopn.com" target="_blank">creator</a>
      </p>
      
      <small>this service is not affiliated in any way with Discord Inc.</small>
    </footer>
  </div>
</div>

<style global>
  :root {
    --background-color: #111;

    --foreground-color: #fff;
    --hover-color: #999;

    --dark-secondary-color: #222;
    --secondary-color: #777;    

    --card-color: #0c0c0c;
    
    --monospace-font-family: 'Fira Code', monospace;
    --font-family: 'Inter', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
  } 

  footer {
    text-align: center;
    font-size: 12px;
    margin-top: 15px;

    font-family: var(--monospace-font-family);
  }

  footer small {
    color: var(--secondary-color);
  }

  body {
    scroll-behavior: smooth;
    
    background-color: var(--background-color);
    color: var(--foreground-color);
    font-family: var(--font-family);

    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: var(--secondary-color);
    text-decoration: none;
    transition: border-bottom 0s ease 0s, color 0.3s ease 0s;
  }

  a:hover, a:active {
    color: var(--foreground-color);
    border-bottom: 2px solid var(--dark-secondary-color);
  }
  
  .site-content {
    display: flex;
    justify-content: center;

    height: 100vh;
  }

  @media screen and (min-height: 1100px) {
    .site-content {
      display: flex;
      
      justify-content: center;
      align-items: center;
    }
  }

  .site-content__inner {
    display: flex;
    flex-direction: column;

    padding: 20px;
  }
</style>