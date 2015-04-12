/*global $  */

var gui = require('nw.gui');

var menubar = new gui.Menu({ type: 'menubar' });

var fileMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({
    label: 'Open Directory',
    click: function() {
        $('#targetDir').click();
    }
}));

menubar.append(new gui.MenuItem({ label: 'File', submenu: fileMenu}));

gui.Window.get().menu = menubar;
