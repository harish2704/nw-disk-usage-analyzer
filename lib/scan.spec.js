/*global describe, it */
var should= require('should');

var scan = require('./scan');

describe('scan function', function(){

    it('should asynchronously scan the filesystem', function(done){
        var gw = scan.scan( '/home/hari/node_modules/connect', function(err, tree ){
            should.not.exist(err);
            should.exist(tree);
            console.log( 'Finished ', new Date() );
            tree.updateSize();
            console.log( 'updated ', new Date() );
            // console.log( tree );
            console.log( JSON.stringify(tree, null, ' ') );
            done();
        });
        // setTimeout(function(){
            // console.log( 'closing');
            // gw.close();
        // }, 3 * 1000 );
        // setTimeout(function(){
            // console.log( 'opening');
            // gw.open();
        // }, 6 * 1000 );
    });
});
