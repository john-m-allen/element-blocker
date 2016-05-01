/* This will save all of the removed element list. */
// [domain][elements]
var removedElements = Object();

/* Get domain. */
function url_domain(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

/* Send request to remove element. */
var removeElement = function(e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {text:"removeElement"});
	});
};

/* Return Removed Elements. */
function returnRemovedElements() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  var url = tabs[0].url;
	  var domain = url_domain(url);
	  console.log(removedElements);
	  chrome.tabs.sendMessage(tabs[0].id, {text:removedElements[domain]});
	});
};

/* Store Removed Elements. */
function storeRemovedElements(elementSelector){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  var url = tabs[0].url;
	  var domain = url_domain(url);
	  if (typeof removedElements[domain] === 'undefined') {
	  	// url => [selector]
	  	removedElements[domain] = [elementSelector];
	  } else {
	  	// url => [selector1, selector2]
	  	removedElements[domain].push(elementSelector);
	  }
	});
}

/* Handle Requests. */
chrome.runtime.onMessage.addListener(function(message){
	if(typeof message.elementRemoved === 'string') {
		// Handle store element request.
		storeRemovedElements(message.elementRemoved);
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
