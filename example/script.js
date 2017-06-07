(function () {
    var Models = (function () {

        /**
         * @typedef {Object} OfferDto
         * @prop {string} PropertySubCategory
         * @prop {string} PropertyCategory
         * @prop {string} PropertyLocation
         * @prop {string} FeaturedImage
         * @prop {string} OfferCategory
         * @prop {string} Geolocation
         * @prop {number} PropertyLat
         * @prop {number} PropertyLng
         * @prop {number} OfferId
         * @prop {string} Title
         * @prop {number} Price
         * @prop {number} Area
         */

        /**
         * @typedef {Object} Models
         * @prop {Array<OfferDto>} OfferList
         * @prop {OfferDto} Offer
         */

        /** @type {OfferDto} */
        var OfferDto = {
            PropertySubCategory: "",
            PropertyCategory: "",
            PropertyLocation: "",
            OfferCategory: "",
            FeaturedImage: "",
            Geolocation: "",
            PropertyLat: 0,
            PropertyLng: 0,
            OfferId: 0,
            Title: "",
            Price: 0,
            Area: 0
        };

        /** @type {Models} */
        var Models = {
            OfferList: [Object.create(OfferDto)],
            Offer: Object.create(OfferDto)
        };

        return Models;
    })();

    MapController.url = "http://realpocapi.azurewebsites.net/api/getPropertyOffersByRange";
    MapController.getHttpObject = getHttpObject;
    MapController.modelType = Models.OfferList;
    MapController.onNewPin = onNewPin;
    MapController.withPost = true;

    /**
     * 
     * @param {Array<object>} model 
     * @param {function(number, number, string, string, number): void} addPin 
     * @param {function(string, object): string} createView
     * @returns {void}
     */
    function onNewPin(model, addPin, createView) {
        for (var item of model) {
            var parseModel = {
                thumb: "data:image/jpg;base64," + item.FeaturedImage,
                apartment: item.PropertySubCategory,
                location: item.PropertyLocation,
                sale: item.OfferCategory,
                price: item.Price,
                area: item.Area,
                more: "More"
            };
            var text = createView("views/offer-view/component.html", parseModel);
            addPin(item.PropertyLat, item.PropertyLng, item.Title, text, 250);
        }
    }

    /**
     * 
     * @param {{latitude: number, longitude: number, range: number, zoom: number}} input
     * @returns {{lng: number, lat: number, range: number, zoom: number}}
     */
    function getHttpObject(input) {
        return {
            lng: input.longitude,
            lat: input.latitude,
            range: input.range,
            zoom: input.zoom
        };
    }
})();