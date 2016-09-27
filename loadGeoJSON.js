function loadGeoJSON (map, layer, url, success, error) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      success(map, layer, JSON.parse(request.responseText));
    }
  };
  // request.onerror = error(request);
  request.send();
}
