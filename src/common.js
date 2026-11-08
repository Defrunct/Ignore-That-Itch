const Icon = Object.freeze({
  IGNORE: "visibility_off",
  SHOW: "visibility",
  NOTE: "info",
  NOTE_BIG: "sticky_note_2"
});

const iconSourceLink = document.createElement("link");
document.head.append(iconSourceLink);
iconSourceLink.rel = "stylesheet";
iconSourceLink.href =
  "https://fonts.googleapis.com/css2" +
  "?family=Material+Symbols+Rounded" +
  ":wght@100..400" +
  "&icon_names=" +
  Object.values(Icon).join(',') +
  "&display=block";


function addIgnoredItem(id, note = undefined) {
  const key = id;
  const data = {};
  if (note !== undefined) data.note = note;
  browser.storage.local.set({ [key]: data });
}

function removeIgnoredItem(id) {
  browser.storage.local.remove(id);
}


function changeIgnoredItemNotePrompt(id) {
  browser.storage.local.get(id).then((results) => {
    if (Object.hasOwn(results, id)) {
      const oldText = results[id].note;
      const newText = prompt(browser.i18n.getMessage("noteChangeTooltip"), oldText)?.trim();
      if (newText === oldText || newText === undefined) return;
      addIgnoredItem(id, newText.length <= 0 ? undefined : newText);
    }
  });
}
