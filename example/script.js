(function () {
    MapController.url = "http://realpocapi.azurewebsites.net/api/getPropertyOffersByRange";
    MapController.getHttpObject = getHttpObject;
    MapController.onNewPin = onNewPin;
    MapController.withPost = true;

    /**
     * Implementation of the onNewPin function
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
     * Implementation of the getHttpObject function
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