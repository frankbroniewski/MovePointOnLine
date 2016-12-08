function animate( map, line, circle, duration ) {

  var iterator = new PointOnLineIterator( line, duration );

  function animatePoint() {

    var point;

    if ( iterator.hasNext() ) {

      point = iterator.next();

      if ( point ) {
        circle.setLatLng([ point.geometry.coordinates[1],
                           point.geometry.coordinates[0] ]);
      } else {
        console.error('no point retrieved');
        cancelAnimationFrame( animatePoint );
      }

      requestAnimationFrame( animatePoint );

    } else {
      cancelAnimationFrame( animatePoint );
    }

  }

  requestAnimationFrame( animatePoint );

}
