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

/* Hide element. */
function hideElement(selector) {
  //CSS implementation. todo figure out if this is best
  var styleRule = selector + ' { display: none; }'
  var sheet = window.document.styleSheets[0];
  if (sheet !== null) {
    if (sheet.cssRules !== null && typeof sheet.cssRules.lenth === 'number') {
        // If styles exist, append to stylesheet.
        sheet.insertRule(styleRule, sheet.cssRules.length);
      } else {
        // If no styles exist, start stylesheet.
        sheet.insertRule(styleRule, 0);
      }
  } else {
    // If no stylesheet, embed css inline (not as robust as using stylesheets).
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = styleRule;
    document.body.appendChild(css);
  }
}

/* Remove element. */
function removeElement() {
  if(typeof currentElement !== 'undefined') {
  	// Store element information.
    var selector = getSelector(currentElement);
  	chrome.runtime.sendMessage({'elementRemoved': selector});
    // Hide element.
    hideElement(selector);

  	// Remove element.
    currentElement.remove();
  }
}

/* Remove saved elements. */
function removeInitialElements(elementSelectors) {
  console.log('Initial Elements Removed: ' + elementSelectors)
  for (var i = 0; i < elementSelectors.length; i++) {
      if(typeof elementSelectors[i] !== 'undefined') {
          var selector = elementSelectors[i];
          // Hide element.
          hideElement(selector);

          // Remove element.
          var element = document.querySelector(selector);
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

