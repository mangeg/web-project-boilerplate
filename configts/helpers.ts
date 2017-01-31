import * as path from "path";
import { join, resolve } from "path";
import * as util from "util";
import { inspect } from "util";

const ROOT = resolve( __dirname, ".." );
const localRoot = join.bind( path, ROOT );

function localLogger( obj: any, showHidden: boolean = false, dept: number = 10 ) {
    console.log( util.inspect( obj, showHidden, dept, true ) );
};

export const root: ( ...paths: string[] ) => string = localRoot;
export const log = localLogger;
export function hasProcessFlag( flag: string ) {
    return process.argv.join( "" ).indexOf( flag ) > -1;
};

export interface IEnvironment {
    HOT: boolean;
    PROD: boolean;
    ENV: string;
}