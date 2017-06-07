<p align="center">
  <img src="https://raw.githubusercontent.com/nickzoum/EzGoogleMap/master/example/favicon.ico" style="height: 128px; width: 128px;"/>
  <h3 align="center" >EzGoogleMap</h3>
  <p align="center">An easy google map plugin</p>
</p>

## Table of Contents

- [Intro](#intro)
- [What's included](#whats-included)
- [Documentation](#documentation)

## Intro

You can also see how the code works under in the example folder

## What's included

In the src folder you'll find the following directory and files

```
src/
├── images/
│   ├── cluster-1.png
│   ├── cluster-2.png
│   ├── cluster-3.png
│   ├── cluster-4.png
│   ├── cluster-5.png
│   └── pin.png
├── unminified/
│   ├── google-map-control.js
│   └── map.css
├── google-map-control.js
└── map.css
```

The `images` folder contains all the images required to show the `clusters` and `pins`
The `unminified` folder contains the properly formatted `script` and `style`
Then there are the minified `google-map-control script` and `map style`

## Documentation

By creating another script you have access to these properties of the map:

 - `getHttpObject`: function that gets the object to be sent with the HTTPRequest (required)
 - `clustering`: whether clustering should be used or not (default is true)
 - `modelType`: the format of the returned model (if empty will normally parse the object)
 - `onNewPin`: function to be called when a new dataset has been loaded and the pins need to be replaced (required)
 - `withPost`: true to use post and false to use get HTTPRequest (default is false-get)
 - `url`: the url that is going to get the data (required)

Function documentation:

```javascript
/**
 * Gets the object to be sent with the HTTPRequest
 * @param {input: {latitude: number, longitude: number, range: number, zoom: number}} input - object showing the position of the viewport
 * @returns {object} - object to be sent
 */
function getHttpObject(input: {latitude: number, longitude: number, range: number, zoom: number}): object
/**
 * Reloads the pins
 * @param {Array<object>} model - The list of models that represent each pin
 * @param {function(latitude: number, longitude: number, title: string, onClickHtml: string, max-width: number): void} addPin - see below
 * @param {function(url: string, model: object, onLoad: function(): void, onRender: function(): void): string} createView - see below
 * @returns {void}
 */
function onNewPin(model: Array<object>, addPin: function(): void, createView : function(): string): object
/**
 * Creates a small window and returns it in text form
 * @param {string} url - Url of view
 * @param {object} model - object to show in view
 * @param {function(): void} [onLoad=] - on load start event
 * @param {function(): void} [onRender=] - on load finish event
 * @returns {void}
 */
function createView(url: string, model: object, onLoad: function(): void, onRender: function(): void): string
/**
 * Adds a new pin to the map
 * @param {number} latitude - The latitude of the pin
 * @param {number} longitude - The longitude of the pin
 * @param {string} [title=] - On hover text
 * @param {string} [onClickHtml=] - On click window
 * @param {number} [max-width=] - max width of window
 * @returns {void}
 */
function addPin(latitude: number, longitude: number, title: string, onClickHtml: string, max-width: number): void
```