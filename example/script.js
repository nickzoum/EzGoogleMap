(function () {
    MapController.url = "http://realpocapi.azurewebsites.net/api/getPropertyOffersByRange";
    MapController.getHttpObject = getHttpObject;
    MapController.onNewPin = onNewPin;
    MapController.withPost = true;

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

    function getHttpObject(latitude, longitude, range, zoom) {
        return {
            lng: longitude,
            lat: latitude,
            range: range,
            zoom: zoom
        };
    }
})();