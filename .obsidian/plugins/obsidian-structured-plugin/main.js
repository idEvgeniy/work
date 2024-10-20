/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => StructurePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian7 = require("obsidian");

// src/helpers/noteRenamer.ts
var NoteRenamer = class {
  constructor(app, finder) {
    this.app = app;
    this.finder = finder;
  }
  async renameNote(file, newName) {
    const newBasePath = file.basename.replace(file.basename, newName);
    const children = this.finder.findChildren(file);
    const newNotesNames = children.map((f) => {
      return {
        file: f,
        newPath: f.path.replace(file.basename, newBasePath)
      };
    });
    for (const f of newNotesNames) {
      await this.app.fileManager.renameFile(f.file, f.newPath);
    }
    await this.app.fileManager.renameFile(file, file.path.replace(file.basename, newBasePath));
  }
};

// src/helpers/noteFinder.ts
var getFullPathWithoutExtension = (path) => {
  const extention = path.split(".").pop();
  if (!extention) {
    return "";
  }
  const extLength = extention.length + 1;
  return path.slice(0, path.length - extLength);
};
var NoteFinder = class {
  constructor(app) {
    this.app = app;
  }
  findChildren(file) {
    const allNotes = this.findNotes();
    return allNotes.filter((n) => {
      return n.path.includes(file.path.slice(0, file.path.length - 3)) && n.parent == file.parent && n != file;
    });
  }
  findParents(file) {
    const allNotes = this.findNotes();
    return allNotes.filter((n) => {
      return getFullPathWithoutExtension(file.path).startsWith(getFullPathWithoutExtension(n.path)) && n.parent == file.parent && n != file;
    });
  }
  findNotes() {
    return this.app.vault.getMarkdownFiles();
  }
  getParentName(file) {
    const noteNamePath = file.basename.split(".");
    if (noteNamePath.length > 1) {
      noteNamePath.pop();
      return noteNamePath.join(".");
    }
    return null;
  }
};

// src/actions.ts
var import_obsidian4 = require("obsidian");

// src/modals/noteRenameModal.ts
var import_obsidian = require("obsidian");
var NoteRenameModal = class extends import_obsidian.Modal {
  constructor(app, file, noteRenamer) {
    super(app);
    this.file = file;
    this.noteRenamer = noteRenamer;
    this.open();
  }
  async rename() {
    const file = this.app.workspace.getActiveFile();
    if (file !== null) {
      await this.noteRenamer.renameNote(file, this.inputField.getValue());
    }
    this.close();
  }
  onOpen() {
    let { contentEl } = this;
    this.titleEl.setText(`Rename note: "${this.file.basename}"`);
    this.inputField = new import_obsidian.TextComponent(contentEl).setValue(this.file.basename);
    this.inputField.inputEl.addEventListener("keypress", async (keypressed) => {
      if (keypressed.key === "Enter") {
        await this.rename();
      }
    });
    this.inputField.inputEl.className = "prompt-input";
    this.modalEl.className = "prompt";
    this.inputField.inputEl.focus();
  }
  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
};

// src/modals/noteFinderModal.ts
var import_obsidian2 = require("obsidian");
var NoteFinderModal = class extends import_obsidian2.FuzzySuggestModal {
  constructor(app, noteOpener, items) {
    super(app);
    this.noteOpener = noteOpener;
    this.items = items;
    this.open();
  }
  getItemText(item) {
    return item;
  }
  getItems() {
    return this.items.map((f) => f.basename);
  }
  onChooseItem(item, evt) {
    const note = this.items.find((f) => f.basename == item);
    if (note) {
      this.noteOpener.openNote(note).then();
    }
  }
  onClose() {
    super.onClose();
  }
};

// src/modals/noteCreateModal.ts
var import_obsidian3 = require("obsidian");
var NoteCreateModal = class extends import_obsidian3.SuggestModal {
  constructor(app, noteCreator, noteOpener, noteFinder, file) {
    super(app);
    this.noteCreator = noteCreator;
    this.noteOpener = noteOpener;
    this.noteFinder = noteFinder;
    this.file = file;
    this.emptyText = "Empty text (replace with nothing)";
    this.notes = this.noteFinder.findNotes().map((f) => f.basename);
    if (file) {
      this.inputEl.value = file.basename;
    }
    this.open();
  }
  getSuggestions(query) {
    let items = [];
    if (query !== "") {
      items.push(query);
    }
    items.push(...this.notes.filter((i) => i.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && query !== i));
    return items;
  }
  selectSuggestion(value, evt) {
    if (!this.notes.find((n) => n == value)) {
      super.selectSuggestion(value, evt);
      return;
    }
    this.inputEl.value = value;
    this.inputEl.dispatchEvent(new Event("input"));
  }
  renderSuggestion(value, el) {
    el.innerText = value;
  }
  async onChooseSuggestion(item, _) {
    let filePath = item + ".md";
    if (this.file) {
      filePath = this.file.parent.path + "/" + filePath;
    }
    let file = await this.noteCreator.createWithTemplate(filePath, item);
    await this.noteOpener.openNote(file);
  }
};

// src/actions.ts
var Actions = class {
  constructor(app, settings, finder, noteRenamer, noteOpener, noteCreator) {
    this.app = app;
    this.settings = settings;
    this.finder = finder;
    this.noteRenamer = noteRenamer;
    this.noteOpener = noteOpener;
    this.noteCreator = noteCreator;
    this.onCreate = () => {
      const file = this.app.workspace.getActiveFile();
      new NoteCreateModal(this.app, this.noteCreator, this.noteOpener, this.finder, file);
    };
    this.onRename = () => {
      const file = this.app.workspace.getActiveFile();
      if (file !== null) {
        new NoteRenameModal(this.app, file, this.noteRenamer);
      }
    };
    this.onGetChild = () => {
      const file = this.app.workspace.getActiveFile();
      if (file !== null) {
        const children = this.finder.findChildren(file);
        new NoteFinderModal(this.app, this.noteOpener, children).open();
      }
    };
    this.onGetParent = () => {
      const file = this.app.workspace.getActiveFile();
      if (file !== null) {
        const parents = this.finder.findParents(file);
        new NoteFinderModal(this.app, this.noteOpener, parents).open();
      }
    };
    this.onOpenParent = async () => {
      const file = this.app.workspace.getActiveFile();
      if (file !== null) {
        const parentNoteName = this.finder.getParentName(file);
        if (parentNoteName !== null) {
          const parents = this.finder.findParents(file);
          const parentFile = parents.find((f) => f.basename == parentNoteName);
          if (parentFile) {
            await this.noteOpener.openNote(parentFile);
          } else {
            const newNote = await this.noteCreator.createParentNote(file, parentNoteName);
            if (newNote) {
              await this.noteOpener.openNote(newNote);
            }
          }
        } else {
          new import_obsidian4.Notice("Root node");
        }
      }
    };
  }
};

// src/settings/settingsTab.ts
var import_obsidian5 = require("obsidian");
var SettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Structured plugin settings" });
    new import_obsidian5.Setting(containerEl).setName("Open notes in split view").setDesc("If disabled: open in current tab").addToggle((v) => v.setValue(this.plugin.settings.openInSplit).onChange(async (value) => {
      this.plugin.settings.openInSplit = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("Create parent").setDesc("Create parent if not exists").addToggle((v) => v.setValue(this.plugin.settings.createParent).onChange(async (value) => {
      this.plugin.settings.createParent = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("Path to template").setDesc("Template for new note (navigating to parent). Available variables: {{NoteName}}").addText((v) => v.setValue(this.plugin.settings.templatePath).onChange(async (value) => {
      this.plugin.settings.templatePath = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/settings/defaults.ts
var DEFAULT_SETTINGS = {
  openInSplit: true,
  createParent: true,
  templatePath: ""
};

// src/helpers/noteOpener.ts
var NoteOpener = class {
  constructor(app, settings) {
    this.app = app;
    this.settings = settings;
    this.openNote = async (file) => {
      const leaf = this.app.workspace.getLeaf(this.settings.openInSplit);
      await leaf.openFile(file);
    };
  }
};

// src/helpers/noteCreator.ts
var import_obsidian6 = require("obsidian");
var NoteCreator = class {
  constructor(app, settings) {
    this.app = app;
    this.settings = settings;
    this.createWithTemplate = async (filePath, noteName) => {
      const newFile = this.app.vault.getAbstractFileByPath((0, import_obsidian6.normalizePath)(this.settings.templatePath));
      let content = "";
      if (this.settings.templatePath) {
        if (newFile && newFile instanceof import_obsidian6.TFile) {
          content = await this.app.vault.cachedRead(newFile);
          content = content.replace(new RegExp("{{NoteName}}", "g"), noteName);
        } else {
          content = "";
        }
      }
      let filePathNormalized = (0, import_obsidian6.normalizePath)(filePath);
      return this.app.vault.create(filePathNormalized, content);
    };
    this.createParentNote = async (currentFile, parentNoteName) => {
      if (this.settings.createParent) {
        new import_obsidian6.Notice("Parent does not exists. Create new one");
        const parentFilePath = (0, import_obsidian6.normalizePath)(currentFile.parent.path + "/" + parentNoteName + ".md");
        return this.createWithTemplate(parentFilePath, parentNoteName);
      } else {
        new import_obsidian6.Notice("Parent does not exists.");
        return null;
      }
    };
  }
};

// src/main.ts
var StructurePlugin = class extends import_obsidian7.Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this.addCommands = () => {
      const noteOpener = new NoteOpener(this.app, this.settings);
      const noteCreator = new NoteCreator(this.app, this.settings);
      const actions = new Actions(this.app, this.settings, this.finder, this.noteRenamer, noteOpener, noteCreator);
      this.addCommand({
        id: "renameNote",
        name: "Rename current note",
        callback: actions.onRename
      });
      this.addCommand({
        id: "createNote",
        name: "Create a note",
        callback: actions.onCreate
      });
      this.addCommand({
        id: "getChildrenNotes",
        name: "Get children notes",
        callback: actions.onGetChild
      });
      this.addCommand({
        id: "getParentNotes",
        name: "Get parents notes",
        callback: actions.onGetParent
      });
      this.addCommand({
        id: "openParentNotes",
        name: "Open parent note",
        callback: actions.onOpenParent
      });
    };
    this.finder = new NoteFinder(app);
    this.noteRenamer = new NoteRenamer(app, this.finder);
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));
    this.addCommands();
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.addCommands();
  }
};


/* nosourcemap */