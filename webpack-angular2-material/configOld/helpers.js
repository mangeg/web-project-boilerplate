/**
 * @author: @AngularClass
 */
var path = require( "path" );
var util = require( "util" );

const EVENT = process.env.npm_lifecycle_event || "";

// Helper functions
var ROOT = path.resolve( __dirname, ".." );

function hasProcessFlag( flag ) {
  return process.argv.join( "" ).indexOf( flag ) > -1;
}

function hasNpmFlag( flag ) {
  return EVENT.includes( flag );
}

function isWebpackDevServer() {
  return process.argv[ 1 ] && !!( /webpack-dev-server/.exec( process.argv[ 1 ] ) );
}

var root = path.join.bind( path, ROOT );

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;

exports.log = function ( obj, showHidden = true, dept = 10 ) {
  console.log( util.inspect( obj, showHidden, dept ) );
}

