/* 
 *  Remove element functionality.
 *
 * TODO: Grab stored elements from basckground.js and remove all elements stored on page load.
 * TODO: Improve storage structure. Use sort by url, then element.
 */

 var currentElement; // The element selected.

/* Remove element. */
function removeElement() {
	// Store element information.
	chrome.runtime.sendMessage({'elementRemoved': currentElement});

	// Remove element.
	currentElement.remove();
}

/* Capture element of right click event. */
window.onmousedown = function(e) {
    // Right click.
    if (e.which === 3 || e.button === 2) {
    	currentElement = e.target;
    }
}

/* Listen for removeElement event. */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text == "removeElement") {
      removeElement();
    }
});