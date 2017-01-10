/* main.js - main.xul's codebehind.
 *
 * Copyright (c) 2016, Mark Bauermeister
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

window.addEventListener("sizemodechange", function(event) { restore('optionspane') }, true);

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/ctypes.jsm")
var cr = Components.classes['@mozilla.org/chrome/chrome-registry;1'].getService(Components.interfaces.nsIChromeRegistry);

// Initialising variable early, so a null string can be caught prior to installApp();
var packagePath;

function restore(ID) {
  var modeless = document.getElementById(ID);
  
  // Restore panel.
  if (window.windowState === 3) {
    openModeless(ID);
    $("#" + ID).removeClass("hoverOut");
  }
  // If window was minimised, hide popup so it can be restored later on.
  else if (window.windowState === 2)
  {
    document.getElementById(ID).hidePopup();
  }
}

function openModeless(ID) {
  let windowX = screen.width * 10;
  let windowY = screen.height;
  var modeless = document.getElementById(ID);
  
  //Opening the panel with a slight delay, to make sure the underlying window is properly set up before.
  setTimeout(function(){modeless.openPopupAtScreen(windowX, windowY / 100, true);}, 100);
}

function closeModeless(ID) {
  var modeless = document.getElementById(ID);
  
  $("#" + ID).addClass("hoverOut");
  
  //Timeout in order to show closing animation.
  setTimeout(function(){
  modeless.hidePopup();
  window.minimize();
  },1000)
}

function closeApp() {
  window.close();
}

function readJSON(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    try {
      rawFile.send(null);
    }
    catch(event){
      jserror("Networking Error");
      winmsg("Check ethernet connection", "Networking Error");
      closeApp();
    }

}

function charCode(el) {

  var char = el;
  var conversion = el.charCodeAt(char.length - 1);

  var emoji = document.getElementById('pasteField');
  emoji.value += char;

  var unicode = document.getElementById('codeField');
  unicode.value = conversion.toString(16);
}

function createMenuItem(aLabel, aValue) {
  const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  var item = document.createElementNS(XUL_NS, "menuitem");
  item.setAttribute("label", aLabel);
  item.setAttribute("value", aValue);
  return item;
}

function initiateLoader() {
  let windowX = screen.width;
  let windowY = screen.height;
  
   try {
    packagePath = document.getElementById("testVersion").selectedItem.value;
  }
  catch(event){
    winmsg("Choose valid item from the list", "Invalid selection");
    return;
  }
  
  document.getElementById("loader").openPopupAtScreen(windowX -10, windowY - 10);

  /* Waiting a second for the animation to start. */
   // Should later be replaced by a proper "promise" mechanism.
setTimeout(function(){uninstallApp();}, 1000);
}
