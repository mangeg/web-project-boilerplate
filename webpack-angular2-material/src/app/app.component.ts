import { Component, OnInit } from "@angular/core";

import { Action } from "redux";

import { NgReduxRouter, routerReducer } from "@angular-redux/router";
import { DevToolsExtension, NgRedux } from "@angular-redux/store";

@Component( {
    selector: "app",
    template: require( "./app.component.html" ),
})
export class AppComponent implements OnInit {

    constructor(
        private ngRedux: NgRedux<any>,
        devTools: DevToolsExtension,
        ngReduxRouter: NgReduxRouter ) {

        ngRedux.configureStore( rootReducer, {}, [], [ devTools.enhancer() ] );
        ngReduxRouter.initialize();
    }



    public ngOnInit() {
    }
}

function rootReducer( state: any, action: Action ): Action {
    return state;
}