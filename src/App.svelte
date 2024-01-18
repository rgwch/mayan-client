<!-- Main view. Loaded by main.ts and holding sub-views -->
<script lang="ts">
  import Cabinets from './lib/Cabinets.svelte';
  import Documents from './lib/Documents.svelte';
  import { mayan } from './lib/model/mayan';
  import { _, isLoading } from 'svelte-i18n';
  import { init } from './lib/model/store';
  let showlogin = true;
  let url: string = localStorage.getItem('url') || '';
  let user: string;
  let pwd: string;
  let autologin: boolean = false;

  /**
   * If we can resume a previous session, we don't need to show the login screen
   */
  mayan.canResume().then((can) => {
    showlogin = !can;
  });
  async function login() {
    try {
      const ok = await mayan.connect(url, user, pwd, autologin);
      if (ok) {
        showlogin = false;
      } else {
        alert($_('login_failed'));
      }
    } catch (e: any) {
      alert($_('login_failed') + e.message);
    }
  }
  let selected: any = null;
  function selection(event: any) {
    selected = event.detail;
  }
</script>

<main class="container p-3 mx-auto">
  {#if $isLoading}
    <div class="flex justify-center">
      <div
        class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16">
        <img src="/loading.gif" alt="loading..." />
      </div>
    </div>
  {:else if showlogin}
    <h1 class="text-2xl font-bold text-center mx-auto">Nito</h1>
    <div
      class="flex flex-col w-full md:w-1/3 mx-auto border-blue-600 border p-5 mt-5 text-lg">
      <input
        class="mb-2"
        type="text"
        bind:value={url}
        placeholder="Mayan Server URL" />
      <input
        class="mb-2"
        type="text"
        bind:value={user}
        placeholder={$_('username')} />
      <input
        class="mb-2"
        type="password"
        bind:value={pwd}
        on:keypress={(e) => {
          if (e.key === 'Enter') {
            login();
          }
        }}
        placeholder={$_('password')} />
      <div class="mb-2 mt-1 flex flex-row">
        <input
          class="mr-2"
          type="checkbox"
          id="autologin"
          bind:checked={autologin} />
        <label for="autologin">{$_('stay_logged_in')}</label>
      </div>
      <button class="large mt-3" on:click={login}>{$_('login')}</button>
      <div class="mt-8 mx-auto font-semibold text-sm text-center">
        {$_('privacy')}
      </div>
    </div>
  {:else}
    {#await init() then done}
      <div class="flex flex-col md:flex-row">
        <div class="mr-3 p-2 border-r border-blue-200">
          <Cabinets on:selected={selection} />
        </div>
        <div class="mr-3 p-2 flex-1">
          <Documents cabinet={selected} />
        </div>
      </div>
    {/await}
  {/if}
</main>

<style>
</style>
