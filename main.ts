import { Plugin, parseFrontMatterTags, getAllTags } from 'obsidian';

interface LinkStylerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: LinkStylerSettings = {
	mySetting: 'default'
}

export default class LinkStyler extends Plugin {
	settings: LinkStylerSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(this.app.workspace.on('file-open', (file) => {
			const linkedFiles = Object.keys(this.app.metadataCache.resolvedLinks[file.path]).map(x => this.app.vault.getAbstractFileByPath(x))
			let linkEl: Element[] = []
			if (linkedFiles.length > 0) {
				linkEl = Array.from(this.app.workspace.containerEl.getElementsByClassName('cm-hmd-internal-link'))
			}
			linkedFiles.forEach(async (f) => {
				const tags = getAllTags(this.app.metadataCache.getFileCache(f))
				if (tags.includes('#incomplete')) {
					linkEl.find(x => x.outerText == f.basename).addClass('custom-link-incomplete')
				}
			})
		}))
		// Also do this when editing and recognizes a new link.
		// Make sure this works with alias [Text](([[Link]]))
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}