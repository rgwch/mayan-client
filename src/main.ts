/**
 * Main entry point of the app. Load App-component and mount it to the DOM.
 */
import './lib/i18n/i18n'
import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
