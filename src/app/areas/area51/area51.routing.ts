import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { Area51DetailsComponent } from "./area51-details.component";
import { Area51Component } from "./area51.component";

const routes: Routes = [
    { path: "area51", component: Area51Component },
    { path: "area51/:id", component: Area51DetailsComponent }

];

@NgModule( {
    declarations: [
        Area51DetailsComponent,
        Area51Component
    ],
    exports: [ RouterModule ],
    imports: [ RouterModule.forChild( routes ) ],
})
export class Area51Routing { }