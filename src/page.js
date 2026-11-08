let meta = document.head.querySelector("meta[name='itch:path']");
if (meta?.content.startsWith("games/")) {
  const id = meta?.content.substring("games/".length);
  if (id) modifyPage(id);

  browser.storage.local.onChanged.addListener((changes) => {
    for (const key of Object.keys(changes)) {
      if (id == key) {
        const newValue = changes[id].newValue;
        setIgnoredPageState(Boolean(newValue));
        setPageNote(newValue?.note);
      }
    }
  });
}


function modifyPage(id) {
  const userTools = document.getElementById("user_tools");
  if (userTools) {
    if (!userTools.querySelector(".iti_page_ignore_btn")) {
      const li = userTools.appendChild(document.createElement("li"));
      li.classList.add("iti_page_ignore_btn");
      const ignoreButton = createPageButton(browser.i18n.getMessage("buttonIgnoreText"), Icon.IGNORE);
      li.append(ignoreButton);
      ignoreButton.addEventListener("click", () => {
        addIgnoredItem(id);
      });
    }

    if (!userTools.querySelector(".iti_page_unignore_btn")) {
      const li = userTools.appendChild(document.createElement("li"));
      li.classList.add("iti_page_unignore_btn");
      const unignoreButton = createPageButton(browser.i18n.getMessage("buttonShowText"), Icon.SHOW);
      li.append(unignoreButton);
      unignoreButton.addEventListener("click", () => {
        removeIgnoredItem(id);
      });
    }

    if (!userTools.querySelector(".iti_page_note_btn")) {
      const li = userTools.appendChild(document.createElement("li"));
      li.classList.add("iti_page_note_btn");
      const noteButton = createPageButton(browser.i18n.getMessage("buttonNoteText"), Icon.NOTE_BIG);
      li.append(noteButton);
      noteButton.addEventListener("click", () => {
        changeIgnoredItemNotePrompt(id);
      });
    }
  }

  const container = document.getElementById("wrapper");
  if (container && !container.querySelector(".iti_page_overlay")) {
    const overlay = document.createElement("div");
    container.append(overlay);
    overlay.classList.add(
      "iti_page_overlay",
      "iti_hidden"
    );

    const label = document.createElement("span");
    label.classList.add("iti_page_overlay_label");
    label.textContent = browser.i18n.getMessage("overlayIgnoredText");
    overlay.append(label, label.cloneNode(true));
  }

  browser.storage.local.get(id).then((results) => {
    setIgnoredPageState(Object.hasOwn(results, id));
    setPageNote(results[id]?.note);
  });
}


function createPageButton(text, iconName) {
  const button = document.createElement("a");
  button.classList.add(
    "action_btn",
    "iti_page_button"
  );

  const icon = document.createElement("span");
  button.append(icon);
  icon.classList.add(
    "svgicon",
    "iti_icon"
  );
  icon.textContent = iconName;

  let label = document.createElement("span");
  button.append(label);
  label.classList.add("full_label");
  label.textContent = text;

  label = label.cloneNode(true);
  button.append(label);
  label.classList.replace("full_label", "mobile_label");

  return button;
}


function setIgnoredPageState(ignored) {
  const overlay = document.querySelector(".iti_page_overlay");
  overlay.classList.toggle("iti_hidden", !ignored);
  const ignoreButton = document.querySelector(".iti_page_ignore_btn");
  ignoreButton?.classList.toggle("iti_hidden", ignored);
  const unignoreButton = document.querySelector(".iti_page_unignore_btn");
  unignoreButton?.classList.toggle("iti_hidden", !ignored);
  const noteButton = document.querySelector(".iti_page_note_btn");
  noteButton?.classList.toggle("iti_hidden", !ignored);
}


function setPageNote(text = undefined) {
  const noteButton = document.querySelector(".iti_page_note_btn a");
  if (text === undefined) {
    noteButton?.setAttribute("title", browser.i18n.getMessage("noteChangeTooltip"));
  }
  else {
    noteButton?.setAttribute("title", text);
  }
}
