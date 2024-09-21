# Nito

Nito was an ancient Mayan trade centre, and this Nito is a client app for the [Mayan EDMS](https://www.mayan-edms.com/)

Its aim is not (at all) to replace the original Mayan UI, but to provide a simpler UI approach for some common tasks which are somewhat hidden in the powerful original Mayan app.

With Nito, you can upload, browse and download documents, you can create, modify and delete cabinets and tags for each document. That's all.

## Prerequisites

Youl'll need an existing Mayan EDMS instance running. I recommend using docker-compose with the compose-file [provided](https://docs.mayan-edms.com/chapters/docker/install_docker_compose.html#docker-compose-install) by Mayan. Create a user for Nito in the Mayan app.

To build Nito, you'll need [NodeJS](https://nodejs.org). Tested Version is 18.18.0.

If you just want to have a quick look without installing the toolchain, you may use <!-- https://nito.surge.sh/ or --> https://mayan-client.vercel.app/. (Note: This comes with no warranties and it can be removed or disabled at any time without notice). You'll still need a running Mayan EDMS instance to connect to.

## Installation

```
git clone https://github.com/rgwch/mayan-client
cd mayan-client
npm i
npm run dev
```
and navigate your favorite browser to http://localhost:5137. At the welcome screen, enter the URL for your Mayan-Server, and your credentials. 


## Deployment

`npm run build`

Then, copy the contents of the `dist` folder to a suitable static web server. (For testing purposes, try `npm run preview` after the build and navigate to http://localhost:4137). 

Or, for a more generic test, copy the contents of the dist-folder somewhere else, open a terminal there, type `npx http-server` and navigate to http://localhost:8080.


## Concepts

Please check the original [documentation](https://docs.mayan-edms.com/index.html) for a full understanding. Here we cover only the parts relevant for Nito, which is a subset of Mayan's features:

A Mayan-Document can have versions. Nito displays only the latest version.

Documents are organized in cabinets (Folders). A document can exist in more than one cabinet. Nito can display all Documents belonging to a cabinet, and can associate and de-associate documents from cabinets.

Documents are further organized with tags. A document can have zero to several tags. Nito can display all documents carrying a given tag and can associate and de-associate tags from documents.

A document can have an associated summary. Nito can display and edit such summaries.

Mayan creates preview images of each page of a document. Nito can display these previews, but also allows to download the original document.

Please note that above operations are only possible, if the logged-in user has the respective role privileges defined in Mayan's fine grained permission system. (e.g. tags are only displayed if the user's role has the permission "View Tags"). So, if something doesn't work in Nito as expected, first check, if you're logged in as a user with sufficient permissions.

## Localization

Nito comes with german, english and french language files, being german the fallback. The language to use is taken from the browser's locale. You can also change the language by calling locale.set() in src/lib/i18n/i18n.ts.
Adding new languanges is easy: Just create a file (e.g. it.json) with all the keys from de.json and translate the values. Then, add `register('it', () => import('./it.json'))` to src/lib/i18n/i18n.ts.

## Web App

On Android and iOS devices, you can use the "add to homescreen" feature to create an App-like launcher for Nito.

## Privacy

Nito does not store anything on any server. It only stores access credentials in the LocalStorage of the Browser, if the user selects "stay logged in".
Clearing the Browser's cache will remove everything. It is possible, however, that the Mayan server, you connect to, stores your requests. That is the same as if you would connect to the server via the Mayan UI.

## Credits

* Of course, this app would be useless without [Mayan EDMS](https://www.mayan-edms.com/)
* Nito is built on [NodeJS](https://nodejs.org) with [Vite](https://vitejs.dev/), [Svelte](https://svelte.dev/), [Typescript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/)

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)
