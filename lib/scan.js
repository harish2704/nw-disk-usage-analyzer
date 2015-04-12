var async = require('async');
var fs = require('fs');
var path = require('path');

function AsyncFSGateway (){

    var self = this;
    this.on = true;
    this.readDirQueue = async.queue(function(dirname, cb){
        fs.readdir( dirname, cb );
    }, 10 );

    this.statQueue = async.queue(function( fPath, cb){
        fs.lstat( fPath, cb );
        // console.log( 'FStat ', fPath );
    }, 10 );

}

AsyncFSGateway.prototype.stat = function(task, cb ){
    this.statQueue.push(task, cb );
};

AsyncFSGateway.prototype.readdir = function(task, cb ){
    this.readDirQueue.push(task, cb );
};

AsyncFSGateway.prototype.open = function(){
    if(!this.on){
        this.readDirQueue.resume();
        this.statQueue.resume();
        this.on = true;
    }
};

AsyncFSGateway.prototype.close = function(){
    
    this.readDirQueue.pause();
    this.statQueue.pause();
    this.on = false;
};


function TreeNode( data ){
    if( data ) {
        if( !data.path ){
            data = { path: data };
        }
    } else {
        data = { };
    }
    this.path = data.path;
    this.name = path.basename( data.path );
    this.children = data.children || [];
    this.parentNode = data.parentNode;
    this.size = data.size;
    this.isFile = data.isFile || false;
}

TreeNode.prototype.toJSON = function(){
    var out = {
        path: this.path,
        name: this.name,
        size: this.size
    };
    if ( !this.isFile ){
        out.children = this.children;
    }
    return out;
};

TreeNode.prototype.updateSize = function(){
    var size = 0;
    if( !this.isFile ){
        for (var i = 0, l = this.children.length; i < l; i ++) {
            var v = this.children[i];
            v.updateSize();
            size += v.size;
        }
        this.size = size;
    }
    return;
}


var scan = function( dirPath, cb ){
    var fsGW = new AsyncFSGateway();
    var out = new TreeNode( dirPath );
    var _scan = function( baseDirNode, cb ){
        var children = fs.readdirSync(baseDirNode.path);
        async.each( children, function(v, cb ){
            var d = { 
                path: baseDirNode.path + path.sep + v,
                parentNode: baseDirNode,
            };
            var childNode = new TreeNode( d );
            baseDirNode.children.push( childNode );
            fsGW.stat(childNode.path, function(err, stat ){
                if(err) {
                    return cb(err); 
                }
                if( stat.isSymbolicLink() ){
                    return cb();
                }
                if( stat.isDirectory() ){
                    return _scan(childNode, cb );
                }
                if( stat.isFile() ){
                    childNode.size = stat.size;
                    childNode.isFile = true;
                }
                return cb();
            });
        }, cb );
    };

    _scan( out, function(err){
        return cb( err, out );
    });
    return fsGW;
};


exports.scan = scan;



