document.body.appendChild(createContextMenuSection());
document.body.appendChild(createContactSection());

function createContextMenuSection() {
	const container = document.createElement("div");
	container.classList.add("main");
	container.appendChild(createHeading("contextMenuHeading"));
	container.appendChild(createEnableContextMenuCheckbox());
	return container;
}

function createEnableContextMenuCheckbox() {
	const container = document.createElement("div");
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.addEventListener("change", () => {
		chrome.storage.local.set({
			"contextMenuEnabled": checkbox.checked
		});
		chrome.contextMenus.update("searchBingVideo", {
			"visible": checkbox.checked
		});
	});
	chrome.storage.local.get("contextMenuEnabled", (storage) => {
		checkbox.checked = storage.contextMenuEnabled;
	});
	const label = document.createElement("label");
	label.textContent = chrome.i18n.getMessage("enableContextMenu");
	label.addEventListener("click", () => {
		checkbox.click();
	});

	container.appendChild(checkbox);
	container.appendChild(label);
	return container;
}

function createContactSection() {
	const container = document.createElement("div");
	container.classList.add("main");
	container.appendChild(createHeading("contactHeading"));
	container.appendChild(createContactInstructions());
	container.appendChild(createDonateButton());	
	return container;
}

function createHeading(message) {
	const heading = document.createElement("div");
	heading.classList.add("heading");
	heading.textContent = chrome.i18n.getMessage(message);
	return heading;
}

function createContactInstructions() {
	const container = document.createElement("div");
	const instructions = document.createElement("text");
	instructions.textContent = chrome.i18n.getMessage("contactInstructions");
	container.appendChild(instructions);
	return container;
}

function createDonateButton() {
	const container = document.createElement("div");
	const button = document.createElement("button");
	button.id = "donateButton";
	button.textContent = chrome.i18n.getMessage("donate");
	button.addEventListener("click", function() {
		window.open("https://www.paypal.com/donate?hosted_button_id=PL5HKJDFX2CK8");
	});
	
	// Close the popup if the user clicks the "donate" button
	button.addEventListener("click", () => {
		window.close();
	});

	container.appendChild(button);
	return container;
}
