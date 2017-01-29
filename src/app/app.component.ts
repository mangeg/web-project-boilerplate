import { Component, OnInit } from "@angular/core";

@Component( {
    selector: "app",
    template: `
    <h1>Title</h1>
    <span>hello from app</span>
    <br> 
    <sc-text></sc-text>`,
})
export class AppComponent implements OnInit {

    constructor() { }

    public ngOnInit() {
    }
}
