/*global $, drawchart  */

var gui = require('nw.gui');
var scan = require('../lib/scan');

var menubar = new gui.Menu({ type: 'menubar' });

var fileMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({
    label: 'Open Directory',
    click: function() {
        var targetDirInput = $('#targetDir');
        targetDirInput.click();
        targetDirInput.change( function() {
            var dirName = targetDirInput.val();
            scan.scan( dirName, function(err, tree ){
                tree.updateSize();
                drawchart(tree);
            });
        });
    }
}));

menubar.append(new gui.MenuItem({ label: 'File', submenu: fileMenu}));

gui.Window.get().menu = menubar;
