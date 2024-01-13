<script lang="ts">
  import Cabinets from './lib/Cabinets.svelte';
  import Documents from './lib/Documents.svelte';
  import { mayan } from './lib/mayan';
  import { _ } from 'svelte-i18n';
  let showlogin = true;
  let url: string = localStorage.getItem('url') || '';
  let user: string;
  let pwd: string;
  let autologin: boolean = false;

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
  {#if showlogin}
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
        placeholder={$_('password')} />
      <div class="mb-2 flex flex-row">
        <input
          class="mr-2"
          type="checkbox"
          id="autologin"
          bind:checked={autologin} />
        <label for="autologin">{$_('stay_logged_in')}</label>
      </div>
      <button class="large" on:click={login}>{$_('login')}</button>
    </div>
  {:else}
    <div class="flex flex-col md:flex-row">
      <div class="mr-3 p-2 border-r border-blue-200">
        <Cabinets on:selected={selection} />
      </div>
      <div class="mr-3 p-2 flex-1">
        <Documents cabinet={selected} />
      </div>
    </div>
  {/if}
</main>

<style>
</style>
