import { addMessages, init, locale, getLocaleFromNavigator } from 'svelte-i18n';

import en from './en.json'
import de from './de.json'
import fr from './fr.json'

addMessages('en', en);
addMessages('de', de);
addMessages('fr', fr);

init({
    fallbackLocale: 'de',
    initialLocale: getLocaleFromNavigator()
})

// To change the locale for testing:
// locale.set('en')
