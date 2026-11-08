for (const node of document.querySelectorAll("[data-i18n]")) {
  const text = browser.i18n.getMessage(node.dataset.i18n);
  node.textContent = text;
}

for (const node of document.querySelectorAll("[data-i18n-title]")) {
  const text = browser.i18n.getMessage(node.dataset.i18nTitle);
  node.setAttribute("title", text);
}


function updateCounter() {
  browser.storage.local.getKeys().then((keys) => {
    let count = 0;
    for (const key of keys) {
      if (hasOnlyNumbers(key)) count++;
    }
    const counter = document.getElementById("counter-number");
    counter.textContent = count;
  });
}

updateCounter();
browser.storage.local.onChanged.addListener(updateCounter);


function loadListFromFile(returnList) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "application/json");

  input.addEventListener("change", () => {
    if (input.files.length <= 0) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      let obj;
      try {
        obj = JSON.parse(reader.result);
      } catch (error) {
        alert(error);
        return;
      }
      returnList(leaveOnlyRelevant(obj));
    });

    reader.readAsText(file);
  });

  input.click();
}


function hasOnlyNumbers(str) {
  return /^[1-9][0-9]*$/.test(str);
}


function leaveOnlyRelevant(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!hasOnlyNumbers(key)) continue;
    const value = {};
    if (Object.hasOwn(obj[key], "note")) {
      value.note = obj[key].note;
    }
    result[key] = value;
  }
  return result;
}


const btnImport = document.getElementById("btn-import");
btnImport?.addEventListener("click", () => {
  loadListFromFile(async (list) => {
    let old = await browser.storage.local.getKeys();
    old = old.filter(hasOnlyNumbers);
    await browser.storage.local.remove(old);
    browser.storage.local.set(list);
  });
});


const btnMerge = document.getElementById("btn-merge");
btnMerge?.addEventListener("click", () => {
  loadListFromFile((list) => {
    browser.storage.local.get().then((current) => {
      for (const id of Object.keys(list)) {
        if (!Object.hasOwn(current, id)) {
          current[id] = list[id];
          continue;
        }
        if (!Object.hasOwn(list[id], "note")) continue;
        if (Object.hasOwn(current[id], "note")) continue;
        current[id].note = list[id].note;
      }
      browser.storage.local.set(current);
    });
  });
});


const btnExport = document.getElementById("btn-export");
btnExport?.addEventListener("click", () => {
  browser.storage.local.get().then((result) => {
    result = leaveOnlyRelevant(result);
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    browser.downloads.download({
      filename: "ignore-that-itch-list.json",
      url: url
    }).then((id) => {

      const callback = (delta) => {
        if (delta.id !== id) return;
        if (!delta.state) return;
        if (delta.state.current === "in_progress") return;
        URL.revokeObjectURL(url);
        browser.downloads.onChanged.removeListener(callback);
      }

      browser.downloads.onChanged.addListener(callback);
    });
  });
});
