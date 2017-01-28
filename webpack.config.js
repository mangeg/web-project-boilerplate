let path = require( "path" );

let main = {
    entry: path.join( __dirname, "app/main.js" ),
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "main-bundle.js"
    }
}

module.exports = [ main ];