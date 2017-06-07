(function (window) {
    if (typeof window["Promise"] !== "function") {
        var Promise = function (callBack) {
            var catchList = cast([function () { }], []);
            var thenList = cast([function () { }], []);
            this.then = function (callBack) {
                if (typeof callBack === "function") thenList.push(callBack);
                return this;
            };
            this.catch = function (callBack) {
                if (typeof callBack === "function") thenList.push(callBack);
                return this;
            };
            function resolve(result) { for (var item of thenList) item(result); }
            function reject(error) { for (var item of catchList) item(error); }
            callBack(resolve, reject);
        }
    } else {
        var Promise = window["Promise"];
    }

    var Functions = (function FunctionsIIFE(global) {

        /**
         * @param {string} json
         * @returns {Object}
         */
        function fromJson(json) {
            try { return JSON.parse(json); }
            catch (err) { return null; }
        }

        /**
         * @param {T} prototype
         * @template T
         * @returns {T}
         */
        function createObject(prototype) {
            if ("function" === typeof prototype) return Object.create(prototype.prototype);
            else return Object.create(prototype);
        }

        /**
         * @param {T} prototype
         * @param {*} value
         * @template T
         * @returns {T}
         */
        function cast(prototype, value) {
            return value;
        }


        /**
     * @param {T} prototype
     * @param {string} json
     * @template T
     * @returns {T}
     */
        function getModel(prototype, json) {
            var object = fromJson(json);
            var type = typeof prototype;
            if (type === "string") {
                if (typeof object === "string") return object;
                else return json;
            } else if (type === "boolean") {
                return object ? true : false;
            } else if (type === "number") {
                return parseFloat(object);
            } else if (type === "function") {
                return prototype;
            } else if (type === "object") {
                var constructor = prototype ? prototype.constructor : undefined;
                if (constructor === undefined) {
                    return undefined;
                } else if (constructor === Array) {
                    if (!object || object.constructor !== Array) return []; var list = [];
                    for (var item of object) list.push(getModel(prototype[0], JSON.stringify(item)));
                    return list;
                } else if (constructor === Date) {
                    var date = new Date(object);
                    if (date.valueOf() === NaN) return new Date();
                    else return date;
                } else if (constructor === Object) {
                    if (!object) return null;
                    for (var key in prototype) {
                        var objectKey = object[key];
                        var prototypeKey = prototype[key];
                        object[key] = getModel(prototypeKey, JSON.stringify(objectKey));
                    }
                    return object;
                }
            } else if (type === "undefined") {
                return object;
            } else if (type === "symbol") {
                return Symbol();
            }
            return undefined;
        }
        /**
         * @param {string} name
         * @param {*} object
         * @returns {void}
         */
        function makeGlobal(name, object) {
            global[name] = object;
        }

        /**
         * @param {string} text
         * @returns {string}
         */
        function removeAllSpaces(text) {
            return String(text || "").replace(/ /g, remove);
            function remove() { return "_"; }
        }

        /**
         * @param {number} number
         * @param {number} decimalPoint
         */
        function round(number, decimalPoint) {
            if (decimalPoint < 0 || decimalPoint > 10) decimalPoint = 2;
            var multiply = Math.pow(10, decimalPoint);
            return Math.round(number * multiply) / multiply;
        }

        /**
         * @param {Object} object
         * @param {string} path
         * @returns {*}
         */
        function getObjectPath(object, path) {
            if (object instanceof Object) {
                var list = String(path).split(".");
                var size = list.length;
                if (size === 0) return null;
                else if (size == 1) return object[path];
                else {
                    var currentObject = object; var index = 0;
                    while (index < size && currentObject) currentObject = currentObject[list[index++]];
                    return index === size ? currentObject : null;
                }
            }
            return null;
        }

        return {
            removeAllSpaces: removeAllSpaces,
            getObjectPath: getObjectPath,
            createObject: createObject,
            makeGlobal: makeGlobal,
            fromJson: fromJson,
            getModel: getModel,
            round: round,
            cast: cast
        };
    })(window);

    var Http = (function HttpIIFE(credentials) {

        /**
         * @param {string} url 
         * @param {object} [data=]
         * @returns {Promise<string>}
         */
        function get(url, data) {
            return new Promise(function (resolve, reject) {
                var request = createCORSRequest("get", url);
                if (request) {
                    request.withCredentials = credentials;
                    request.setRequestHeader('Accept', 'application/json');
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.onloadend = function () { onLoadEnd(request, resolve, reject); }
                    if (typeof data === "object" || typeof data === "string") request.send(data);
                    else request.send();
                    request.send();
                } else {
                    reject("CORS not supported");
                }
            }
            );
        }

        /**
         * @param {string} url 
         * @param {object} [data=]
         * @returns {Promise<string>}
         */
        function post(url, data) {
            return new Promise(function (resolve, reject) {
                var request = createCORSRequest("post", url);
                if (request) {
                    request.withCredentials = credentials;
                    request.setRequestHeader('Accept', 'application/json');
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.onloadend = function () { onLoadEnd(request, resolve, reject); }
                    if (typeof data === "object" || typeof data === "string") request.send(data);
                    else request.send();
                } else {
                    reject("CORS not supported");
                }
            });
        }

        /**
         * @param {XMLHttpRequest} request 
         * @param {function(string):void} resolve 
         * @param {function(string):void} reject 
         * @returns {void}
         */
        function onLoadEnd(request, resolve, reject) {
            var status = request.status;
            var result = String(request.response);
            if (status >= 200 && status < 300) resolve(result);
            else reject(result);
        }

        /**
         * @param {string} method 
         * @param {string} url 
         * @returns {XMLHttpRequest}
         */
        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if (xhr.withCredentials != undefined) {
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }
            return xhr;
        }

        /**
         * @param {string} name 
         * @returns {string}
         */
        function getCookieByName(name) {
            var list = document.cookie.split("; ");
            for (var cookie of list) {
                var cookieList = cookie.split("=");
                if (cookieList[0] == name) {
                    return cookieList[1];
                }
            }
            return null;
        }

        /**
         * @param {string} name
         */
        function deleteCookieByName(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };

        return {
            deleteCookieByName: deleteCookieByName,
            getCookieByName: getCookieByName,
            post: post,
            get: get
        };
    })(false);

    var NZapp = (function NZappIIFE(Functions, loadingUrl) {

        var ViewInfo = {
            onFinish: function () { },
            onLoad: function () { },
            model: {}
        };

        var viewInfoList = Functions.cast([ViewInfo], []);

        var actions = {
            "nz-text": nzText,
            "nz-link": nzLink,
            "nz-src": nzSrc
        };

        /**
         * @param {HTMLElement} dom
         * @param {string} value
         * @returns {void}
         */
        function nzText(dom, value) {
            dom.innerText = value;
        }

        /**
         * @param {HTMLElement} dom
         * @param {string} value
         * @returns {void}
         */
        function nzLink(dom, value) {
            dom.setAttribute("href", value);
        }

        /**
         * @param {HTMLElement} dom
         * @param {string} value
         * @returns {void}
         */
        function nzSrc(dom, value) {
            dom.setAttribute("src", value);
        }

        /**
         * @param {HTMLElement} dom
         * @param {Object} model
         */
        function replaceText(dom, model) {
            var iterator = document.createNodeIterator(dom, NodeFilter.SHOW_TEXT);
            var regex = /{[^}]{0,}}/g, node = undefined;
            while (node = iterator.nextNode()) {
                if (node.parentElement === dom) {
                    node.textContent = node.textContent.replace(regex, valueReplace);
                }
            }
            /**@param {string} path
             * @returns {model} */
            function valueReplace(path) {
                path = path.substring(1, path.length - 1);
                return Functions.getObjectPath(model, path) || "";
            }
        }


        /**
         * @param {Event} event
         * @returns {void}
         */
        function activateElement(event) {
            var target = event.srcElement;
            var document = target.contentWindow.document;
            var info = viewInfoList[target.getAttribute("nz-id") - 1];
            info.onLoad();
            for (var dom of document.body.getElementsByTagName("*")) {
                for (var action in actions) {
                    if (dom.hasAttribute(action)) {
                        var attr = dom.getAttribute(action); var value = null;
                        var value = Functions.getObjectPath(info.model, attr);
                        if (value !== null) actions[action](dom, value);
                    }
                }
                replaceText(dom, info.model);
            }
            if (target.nextElementSibling) target.nextElementSibling.remove();
            target.style.height = (document.body.clientHeight + 5) + "px";
            target.style.width = (document.body.clientWidth + 5) + "px";
            target.style.display = "block";
            info.onFinish();
        }

        /**
     * @param {string} view
     * @param {Object} [model=]
     * @param {function(): void} [onLoad=]
     * @param {function(): void} [onFinish=]
     * @returns {HTMLElement}
     */
        function createView(view, model, onLoad, onFinish) {
            var info = Functions.createObject(ViewInfo);
            info.onFinish = onFinish || function () { };
            info.onLoad = onLoad || function () { };
            info.model = model || {};
            var wrapper = document.createElement("div");
            var iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", view);
            iFrame.setAttribute("nz-id", viewInfoList.push(info));
            iFrame.setAttribute("onload", "NZapp.activateElement(event)");
            iFrame.style.display = "none";
            iFrame.style.border = "none";
            var loader = document.createElement("img");
            loader.src = loadingUrl;
            loader.style.height = "20px";
            loader.style.width = "20px";
            wrapper.appendChild(iFrame);
            wrapper.appendChild(loader);
            return wrapper;
        }

        /**
         * @param {string} view
         * @param {Object} [model=]
         * @param {function(): void} [onLoad=]
         * @param {function(): void} [onFinish=]
         * @returns {string}
         */
        function createTextView(view, model, onLoad, onFinish) {
            return createView(view, model, onLoad, onFinish).outerHTML;
        }

        return {
            activateElement: activateElement,
            createTextView: createTextView,
            createView: createView
        };
    })(Functions, "https://i.stack.imgur.com/kOnzy.gif");

    var MapHelper = (function MapHelperIIFE(mapElement, pinPath) {
        var clusterStyles = [
            {
                url: 'images/cluster-1.png',
                textColor: 'white',
                textSize: 16,
                height: 52,
                width: 52
            }, {
                url: 'images/cluster-2.png',
                textColor: 'white',
                textSize: 17,
                height: 55,
                width: 56
            }, {
                url: 'images/cluster-3.png',
                textColor: 'white',
                textSize: 18,
                height: 65,
                width: 66
            }, {
                url: 'images/cluster-4.png',
                textColor: 'white',
                textSize: 19,
                height: 89,
                width: 90
            }, {
                url: 'images/cluster-5.png',
                textColor: 'white',
                textSize: 20,
                height: 77,
                width: 78
            },
        ];
        var infowindowList = [];
        var clusterList = [];
        var map = undefined;
        var circleList = [];
        var pinList = [];

        /**
         * @param {number} latitude 
         * @param {number} longitude 
         * @param {object} map 
         * @param {string} [title=]
         * @param {string} [text=]
         * @param {number} [width=]
         * @returns {void}
         */
        function newPin(latitude, longitude, title, text, width) {
            var position = {
                lat: latitude,
                lng: longitude
            };
            var pin = new google.maps.Marker({
                title: title || undefined,
                position: position,
                icon: pinPath,
                map: map
            });
            pinList.push(pin);
            if (typeof text === "string") {
                var infowindow = new google.maps.InfoWindow({
                    maxWidth: (isNaN(width) ? 200 : width) + 20,
                    content: text
                });
                pin.addListener("click", function () {
                    infowindow.open(map, pin);
                });
                infowindowList.push(infowindow);
            }
        }

        /**
         * @param {number} latitude 
         * @param {number} longitude 
         * @param {number} radius 
         * @returns {void}
         */
        function newCircle(latitude, longitude, radius) {
            var position = {
                lat: latitude,
                lng: longitude
            };
            var circle = new google.maps.Circle({
                strokeColor: '#CCCCCC',
                fillColor: '#CCCCCC',
                strokeOpacity: 0.8,
                fillOpacity: 0.35,
                center: position,
                strokeWeight: 2,
                radius: radius,
                map: map
            });
            circleList.push(circle);
        }

        /**
         * @param {number} latitude 
         * @param {number} longitude 
         * @param {number} zoom
         * @returns {void}
         */
        function reset(latitude, longitude, zoom) {
            var old = google.maps.InfoWindow.prototype.open;
            google.maps.InfoWindow.prototype.open = function (a, b) {
                for (var item of infowindowList) item.close();
                old.call(this, a, b);
            }
            var position = {
                lat: latitude,
                lng: longitude
            };
            map = new google.maps.Map(mapElement, {
                center: position,
                zoom: zoom
            });
            var loader = document.createElement("div");
            loader.innerText = "Loading ...";
            mapElement.appendChild(loader);
            loader.className = "loader";
        }

        /**
         * @param {function(number, number, number): void} callBack
         * @returns {void}
         */
        function onMove(callBack) {
            map.addListener('idle', function () {
                if (typeof callBack === "function") {
                    var now = Date.now();
                    callBack(map.center.lat(), map.center.lng(), zoomToRange(map.zoom));
                }
            });
        }

        /**
         * @param {number} zoom
         * @returns {number}
         */
        function zoomToRange(zoom) {
            var gradZoom = Math.pow(2, 22 - zoom);
            var width = Math.min(mapElement.clientWidth, mapElement.clientHeight);
            var ratio = 0.0145;
            return width * ratio * gradZoom;
        }

        /**
         * @returns {void}
         */
        function clearItems() {
            for (var item of pinList) item.setMap(null); pinList = [];
            for (var item of clusterList) item.clearMarkers(); clusterList = [];
            for (var item of circleList) item.setMap(null); circleList = [];
            infowindowList = [];
        }

        /**
         * @returns {void}
         */
        function startLoad() {
            mapElement.classList.add("loading");
        }

        /**
         * @returns {void}
         */
        function stopLoad() {
            mapElement.classList.remove("loading");
        }

        /**
         * @returns {void}
         */
        function addCluster() {
            var cluster = new MarkerClusterer(map, pinList, { styles: clusterStyles });
            clusterList.push(cluster);
        }

        /**
         * @param {HTMLElement} element
         * @returns {HTMLElement}
         */
        function appendChild(element) {
            return mapElement.appendChild(element);
        }

        return {
            zoomToRange: zoomToRange,
            appendChild: appendChild,
            addCluster: addCluster,
            clearItems: clearItems,
            newCircle: newCircle,
            startLoad: startLoad,
            stopLoad: stopLoad,
            onMove: onMove,
            newPin: newPin,
            reset: reset
        };
    })(document.getElementById("map"), "images/pin.png");

    (function MapControllerIIFE(Functions, Http, MapHelper, NZapp) {
        var getHttpObject = function () { };
        var onNewPin = function () { };
        var defaultLon = 23.7300974;
        var defaultLat = 37.991087;
        var getData = Http.get;
        var clustering = true;
        var isLoading = false;
        var defaultZoom = 12;
        var canMove = true;
        var modelType = {};
        var delay = 0;
        var url = "";

        Functions.makeGlobal("initMap", function () {
            getHttpObject = MapController.getHttpObject; onNewPin = MapController.onNewPin; url = MapController.url; modelType = MapController.modelType;
            if (typeof getHttpObject !== "function") throw new Error("The getHttpObject function of the MapController has not been defined");
            if (typeof onNewPin !== "function") throw new Error("The onNewPin function of the MapController has not been defined");
            if (typeof url !== "string") throw new Error("The url property of the MapController has not been defined");
            if (MapController.clustering === false) clustering = false;
            if (MapController.withPost === true) getData = Http.post;
            MapHelper.reset(defaultLat, defaultLon, defaultZoom);
            MapHelper.onMove(onReload); MapHelper.stopLoad();
            onReload(defaultLat, defaultLon, MapHelper.zoomToRange(defaultZoom));
        });

        /**
         * @param {string} res
         * @returns {void}
         */
        function onDataLoad(res) {
            setTimeout(function () {
                MapHelper.clearItems();
                var model = Functions.getModel(modelType, res);
                onNewPin(model, MapHelper.newPin, createView);
                if (clustering) MapHelper.addCluster();
                MapHelper.stopLoad();
                isLoading = false;
                function createView(view, model, onLoad, onFinish) {
                    return NZapp.createTextView(view, model, function () {
                        onNewViewLoaded();
                        if (typeof onLoad === "function") {
                            try { onLoad(); }
                            catch (err) { console.error(err); }
                        }
                    }, function () {
                        onNewViewRendered();
                        if (typeof onFinish === "function") {
                            try { onFinish(); }
                            catch (err) { console.error(err); }
                        }
                    });
                }
            }, delay);
        }

        /**
         * @param {string} err
         * @returns {void}
         */
        function showBadRequest(err) {
            console.error(err);
            MapHelper.stopLoad();
            isLoading = false;
        }

        function onReload(latitude, longitude, zoom) {
            if (canMove) {
                if (!isLoading) {
                    isLoading = true;
                    MapHelper.startLoad();
                    zoom = Functions.round(zoom, 0);
                    latitude = Functions.round(latitude, 5);
                    longitude = Functions.round(longitude, 5);
                    var object = getHttpObject({
                        latitude: latitude,
                        longitude: longitude,
                        zoom: 0,
                        range: zoom
                    });
                    var data = typeof object === "string" ? object : JSON.stringify(object);
                    getData(url, data).then(onDataLoad).catch(showBadRequest);
                }
            }
            canMove = true;
        }

        function onNewViewLoaded() {
            canMove = false;
        }

        function onNewViewRendered() {
            setTimeout(function () { canMove = true; }, 500);
        }

        /**
         * @typedef {Object} MapController
         * @prop {function({latitude: number, longitude: number, range: number, zoom: number}): object} getHttpObject
         * @prop {boolean} clustering 
         * @prop {object} modelType
         * @prop {function(object, function(): void, function(): void): void} onNewPin
         * @prop {boolean} withPost
         * @prop {string} url
         */

        /** @type {MapController} */
        var mapController = {
            getHttpObject: undefined,
            clustering: undefined,
            modelType: undefined,
            withPost: undefined,
            onNewPin: undefined,
            url: undefined
        };

        Functions.makeGlobal("MapController", mapController);
    })(Functions, Http, MapHelper, NZapp);

})(window);