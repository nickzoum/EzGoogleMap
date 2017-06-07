<p align="center">
  <img src="https://raw.githubusercontent.com/nickzoum/EzGoogleMap/master/example/favicon.ico" />
  <h3 align="center" >EzGoogleMap</h3>
  <p align="center">An easy google map plugin</p>
</p>

## Table of Contents

- [Intro](#intro)
- [What's included](#whats-included)
- [Documentation](#documentation)
- [Using Views](#using-views)

## Intro

This is a simple javascript & css plugin that allows you to more easily use google maps markers 
You can also see how the code works under in the <a href="https://github.com/nickzoum/EzGoogleMap/tree/master/example" target="_blank">example folder</a>

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

These are the properties of the map that you can alter:

 - `getHttpObject`: function that gets the object to be sent with the HTTPRequest (required)
 - `clustering`: whether clustering should be used or not (default is true)
 - `modelType`: the format of the returned model (if empty will normally parse the object)
 - `onNewPin`: function to be called when a new dataset has been loaded and the pins need to be replaced (required)
 - `withPost`: true to use post and false to use get HTTPRequest (default is false-get)
 - `url`: the url that is going to get the data (required)

Function documentation:

```javascript
/**
 * Gets the object to be sent with the HTTPRequest based on the viewport
 * @param {number} latitude - latitude of map
 * @param {number} longitude - longitude of map
 * @param {number} range - radius of visible viewport in meters 
 * @param {number} zoom - zoom level of map
 * @returns {object} - object to be sent
 */
function getHttpObject(latitude: number, longitude: number, range: number, zoom: number): object
/**
 * Reloads the pins
 * @param {Array<object>} model - The list of models that represent each pin
 * @param {function} addPin - see below
 * @param {function} createView - see below
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

## Using Views

You can write simple html and using these 4 ways you can add basic text or links to the dom

 - `nz-text`: sets the textContent | value depending on the type of element
 - `nz-link`: sets the href attribute
 - `nz-src`: sets the src attribute
 - `interpolation`: using simple brackets replaces the text in the bracket 

See example <a href="https://github.com/nickzoum/EzGoogleMap/blob/master/example/views/offer-view/component.html" target="_blank">here</a>