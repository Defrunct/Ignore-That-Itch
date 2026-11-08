for (const cell of document.querySelectorAll(".game_cell")) {
  modifyCell(cell);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) continue;
      if (node.classList.contains("game_cell")) {
        modifyCell(node);
      }
      for (const cell of node.querySelectorAll(".game_cell")) {
        modifyCell(cell);
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });


browser.storage.local.onChanged.addListener((changes) => {
  for (const id of Object.keys(changes)) {
    for (const cell of document.querySelectorAll(`.game_cell[data-game_id="${id}"]`)) {
      const newValue = changes[id].newValue;
      setIgnoredCellState(cell, Boolean(newValue));
      setCellNote(cell, newValue?.note);
    }
  }
});


function modifyCell(cell) {
  const id = getCellID(cell);
  if (id === undefined) return;

  const thumb = getThumbFromCell(cell);
  if (thumb.querySelector(".iti_cell_overlay")) return;

  let tools;
  let compact = false;
  tools = cell.querySelector(".game_cell_tools");
  if (!tools) {
    tools = cell.querySelector(".cell_tools");
    compact = true;
  }
  if (!tools && thumb) {
    tools = document.createElement("div");
    thumb.append(tools);
    tools.classList.add("game_cell_tools");
    compact = false;
  }
  tools?.append(createCellIgnoreButton(id, compact));

  thumb?.append(createCellOverlay(id));

  browser.storage.local.get(id).then((results) => {
    setIgnoredCellState(cell, Object.hasOwn(results, id));
    setCellNote(cell, results[id]?.note);
  });
}


function getCellID(cell) {
  return cell.dataset.game_id;
}


function getThumbFromCell(cell) {
  let thumb = cell.querySelector(".bordered");
  if (!thumb) thumb = cell.querySelector(".game_thumb");
  return thumb;
}


function createCellIgnoreButton(id, compact) {
  const button = document.createElement(compact ? "button" : "a");
  const text = browser.i18n.getMessage("buttonIgnoreText");
  if (compact) {
    button.classList.add("iti_icon");
    button.setAttribute("title", text);
  }
  else {
    button.classList.add("action_btn");
    button.textContent = text;
  }

  const icon = document.createElement("span");
  button.prepend(icon);
  if (!compact) icon.classList.add("icon");
  icon.classList.add(
    "icon-playlist_add",
    "iti_icon"
  );
  icon.textContent = Icon.IGNORE;
  if (compact) icon.setAttribute("aria-hidden", true);

  button.addEventListener("click", () => {
    addIgnoredItem(id);
  });

  return button;
}


function createCellOverlay(id) {
  const overlay = document.createElement("div");
  overlay.classList.add(
    "iti_cell_overlay",
    "iti_hidden"
  );

  const label = document.createElement("span");
  overlay.append(label);
  label.classList.add("iti_cell_overlay_label");
  label.textContent = browser.i18n.getMessage("overlayIgnoredText");

  const note = document.createElement("a");
  label.append(note);
  note.classList.add(
    "iti_cell_note",
    "iti_icon"
  );
  note.textContent = Icon.NOTE;
  note.setAttribute("title", browser.i18n.getMessage("noteChangeTooltip"));
  note.addEventListener("click", () => {
    changeIgnoredItemNotePrompt(id);
  });

  const button = document.createElement("a");
  overlay.append(button);
  button.classList.add("iti_cell_unignore_btn");
  button.textContent = browser.i18n.getMessage("buttonShowText");
  button.addEventListener("click", () => {
    removeIgnoredItem(id);
  });

  const icon = document.createElement("span");
  button.prepend(icon);
  icon.classList.add("iti_icon");
  icon.textContent = Icon.SHOW;

  return overlay;
}


function setIgnoredCellState(cell, ignored) {
  const overlay = cell.querySelector(".iti_cell_overlay");
  overlay?.classList.toggle("iti_hidden", !ignored);
  if (ignored) cell.setAttribute("data-iti_ignored_cell", "");
  else cell.removeAttribute("data-iti_ignored_cell");

  const thumb = getThumbFromCell(cell);
  if (ignored) thumb?.addEventListener("mousemove", cancelEvent);
  else thumb?.removeEventListener("mousemove", cancelEvent);
}


function setCellNote(cell, text = undefined) {
  const note = cell.querySelector(".iti_cell_note");
  if (text === undefined) {
    note?.setAttribute("title", browser.i18n.getMessage("noteChangeTooltip"));
  }
  else {
    note?.setAttribute("title", text);
  }
}


function cancelEvent(event) {
  event.stopImmediatePropagation();
}
