
function FileItem (name, stat){
    if ( stat.isFile() || stat.isDirectory() ){
        this._isFile = isFile();
    } else {
        this._isFile = null;
    }

    this.name = name;
}

FileItem.prototype.getSize = 
