// When the extension is initially installed, set the default settings, then open the options page
chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason == "install") {
		const defaultSettings = {
			"contextMenuEnabled": true
		};
  	chrome.storage.local.set(defaultSettings, () => {
  		updateContextMenu();
			chrome.runtime.openOptionsPage();
  	});
  }
});

// Create the "search Bing Video" context menu. If the user has disabled it, then hide it.
chrome.contextMenus.create({
	"id": "searchBingVideo",
	"contexts": ["selection"],
	"title": chrome.i18n.getMessage("searchBingVideo")
}, updateContextMenu);

chrome.contextMenus.onClicked.addListener((info) => {
	chrome.tabs.create({
		"url": chrome.i18n.getMessage("bingVideoSearchUrl", info.selectionText)
	});
});

function updateContextMenu() {
	chrome.storage.local.get("contextMenuEnabled", (storage) => {
		chrome.contextMenus.update("searchBingVideo", {
			"visible": storage.contextMenuEnabled
		});
	});
}
