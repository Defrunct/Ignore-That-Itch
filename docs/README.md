<div align="center">

![Ignore That Itch icon](../src/icons/icon128.png)

</div>

# Ignore That Itch
A browser extension that adds an Ignore button to game and product pages on itch.io.

## README in other languages
README in English\
[README українською](README_UA.md)

## Features
- Mark pages as Ignored with a single button click.
- Changes are automatically synced between tabs — no need to refresh pages.
- Add notes to explain the reason a page is ignored.
- Export, import and merge ignore lists in the extension's settings.
  - Exporting lets you save the list to a file. Useful for creating backups or transferring ignore list to another device.
  - Importing lets you load the list from a file. This will **erase** the current list.
  - Merging, unlike importing, **preserves** the current list and adds missing entiries from the file. It also adds notes from the file to entries that don't have them.

## Install
### Firefox
1. Open [extension's page]() on the Firefox Add-on store.
2. Click the "Add to Firefox" button.
3. When prompted, click "Add".

You can select "Allow extension to run in private windows" so that Ignore That Itch works there as well.

### Google Chrome and other browsers
1. Download the [archive]() containing the extension files.
2. Extract it to a folder of your choice.
3. Open your browser and go to the extensions management page ([chrome://extensions/](chrome://extensions)).
4. Enable "Developer mode".
5. Click "Load unpacked".
6. Select the folder containing the extracted Ignore That Itch files (it must contain `manifest.json`).

Don't disable "Developer mode", or the extension won't work.

To use Ignore That Itch in Incognito mode, open "Details" and enable "Allow in Incognito".

## Update
The Firefox version updates automatically.

For other browsers follow these steps:
1. Download the [archive]() containing the extension files.
2. Open the folder where you installed the extension.
3. Replace its contents with the files from the archive.
4. Restart your browser.\
   Or open the extensions management page ([chrome://extensions/](chrome://extensions)) and click "Update".

You should make a backup of your ignore list before updating. To do so, click the "Export" button in the extension's settings.

You can subscribe to this repository's releases to receive notifications about new versions of the extension.

### Why doesn't the Chrome version update automatically?
Google charges $5 fee to register developer account in their store.

I don't use Chrome. And I think that charging a fee for publishing (free) add-ons that add functionality and improve the browser user experience — is an anti-consumer practice.

Therefore, Ignore That Itch can currently only be installed in Chrome and other Chromium-based browsers using "Developer Mode".

However, if demand is high enough, I will reconsider the possibility of publishing it on the Chrome Web Store.
