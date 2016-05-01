/* This will save all of the deleted element list. */
var removedElements = [];

/* Send request to remove element. */
var removeElement = function(e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {text:"removeElement"});
	});
};

/* Return Removed Elements. */
function returnRemovedElements() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {text:removedElements});
	});
};

/* Store Removed Elements. */
function storeRemovedElements(elementSelector){
	removedElements.push(elementSelector);
}

/* Handle Requests. */
chrome.runtime.onMessage.addListener(function(message){
	if(typeof message.elementRemoved === 'string') {
		// Handle store element request.
		storeRemovedElements(message.elementRemoved);
		alert('Total Elements Removed: ' + removedElements.length);
	} else if(message.getElements === true) {
		// Handle get elements request.
		returnRemovedElements();
	}
});

/* Right click menu. */
chrome.contextMenus.create({
    "title": "Remove Element",
    "contexts": ["all"],
    "onclick" : removeElement
});
