import { ApplicationRef, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { bootloader, createInputTransfer, createNewHosts, removeNgStyles } from "@angularclass/hmr";

import { AppState, InternalStateType } from "./app.service";

const APP_PROVIDERS = [
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

import "../styles/headings.css";
import "../styles/styles.scss";

import { ENV_PROVIDERS } from "./environment";

import { AppComponent } from "./app.component";
import { TextComponent } from "./text/text.component";

@NgModule( {
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, TextComponent ],
    imports: [ BrowserModule ],
    providers: [
        APP_PROVIDERS,
        ENV_PROVIDERS,
    ],
})
export class AppModule {
    constructor(
        public appRef: ApplicationRef ) {
    }

    public hmrOnInit( store: StoreType ) {
        if ( !store || !store.state ) {
            return;
        }

        // console.log( "HMR store", JSON.stringify( store, null, 2 ) );
        // set state
        // this.appState._state = store.state;
        // set input values
        if ( "restoreInputValues" in store ) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout( restoreInputValues );
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy( store: StoreType ) {
        const cmpLocation = this.appRef.components.map(( cmp ) => cmp.location.nativeElement );
        // save state
        // const state = this.appState._state;
        // store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts( cmpLocation );
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy( store: StoreType ) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}