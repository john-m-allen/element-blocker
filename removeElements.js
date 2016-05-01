/* 
 *  Remove element functionality.
 *
 * TODO: Grab stored elements from basckground.js and remove all elements stored on page load.
 * TODO: Improve storage structure. Use sort by url, then element.
 */

 var currentElement; // The element selected.

 /* Get element selector. */
function getSelector(el){
  // TODO: Make this more robust, use attributes etc.
  var names = [];
  while (el.parentNode){
    if (el.id){
      names.unshift('#'+el.id);
      break;
    }else{
      if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
      else{
        for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
        names.unshift(el.tagName+":nth-child("+c+")");
      }
      el=el.parentNode;
    }
  }
  return names.join(" > ");
}

/* Remove element. */
function removeElement() {
  if(typeof currentElement !== 'undefined') {
    	// Store element information.
      var selector = getSelector(currentElement);
    	chrome.runtime.sendMessage({'elementRemoved': selector});

    	// Remove element.
      currentElement.remove();
  }
}

/* Remove saved elements. */
function removeInitialElements(elementSelectors) {
  console.log('Initial Elements Removed: ' + elementSelectors)
  for (var i = 0; i < elementSelectors.length; i++) {
      if(typeof elementSelectors[i] !== 'undefined') {
          // Remove element.
          var element = document.querySelector(elementSelectors[i]);
          if (element !== null) {
            element.remove();
          }
      }
  }
}

/* Capture element of right click event. */
window.onmousedown = function(e) {
    // Right click.
    if (e.which === 3 || e.button === 2) {
    	currentElement = e.target;
    }
}

/* Listen for removeElement and removeInitialElements event. */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text == "removeElement") {
      // Handle Request to remove currently selected element.
      removeElement();
    } else if(typeof request.text == 'object') {
      // Handle request to remove initial elements.
      removeInitialElements(request.text);
    }
});

/* Request list of removed elements. */
chrome.runtime.sendMessage({'getElements': true});

