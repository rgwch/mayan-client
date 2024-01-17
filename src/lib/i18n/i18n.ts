import { addMessages, init, locale, register, getLocaleFromNavigator } from 'svelte-i18n';


register('en', () => import('./en.json'));
register('de', () => import('./de.json'));
register('fr', () => import('./fr.json'));


init({
    fallbackLocale: 'de',
    initialLocale: getLocaleFromNavigator()
})

// To change the locale for testing:
// locale.set('en')
