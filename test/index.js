const { Cc, Ci } = require('chrome');
var { openDialog } = require('sdk/window/utils');
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "cmd-link",
  label: "Open commandline",
  icon: {
    "16": "./icon.svg",
    "32": "./icon.svg",
    "64": "./icon.svg"
  },
  onClick: handleClick
});

function openSurface() {
    var window = openDialog({
        // No "url" supplied here in this case as we add it below (in order to have a ready listener in place before load which can give us access to the tab worker)
        // For more, see https://developer.mozilla.org/en-US/docs/Web/API/window.open#Position_and_size_features
        features: Object.keys({
            chrome: false, // Needed for centerscreen per docs
            centerscreen: true, // Doesn't seem to be working for some reason (even though it does work when calling via XPCOM)
            resizable: true,
            scrollbars: true
        }).join() + ',width=850,height=650',
        name: "My window name " + Math.random().toString(36).substring(7),
        url:"chrome://browser/content/emoji/main.xul"
        // parent: 
        // args: 
    });
    var windowList = (windows())
    for (var windowNo in windowList) {
        console.log(windowNo)
    }
}

function handleClick(state) {
  openSurface();
}
