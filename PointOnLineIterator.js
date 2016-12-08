// needs turfjs to operate

function PointOnLineIterator( way, travelTime ) {

  this.way = way;
  this.wayDistance = turf.lineDistance( this.way );
  this.accuDistance = 0;
  this.travelTime = travelTime;
  this.fps = 1000 / 60;
  this.stepLength = this.wayDistance / this.travelTime * this.fps;

}


PointOnLineIterator.prototype.next = function() {

  var point;

  if ( this.accuDistance < this.wayDistance ) {

    point = turf.along(this.way.features[ 0 ], this.accuDistance, 'kilometers');
    this.accuDistance = this.accuDistance + this.stepLength;
    return point;

  }

  return false;

}


PointOnLineIterator.prototype.hasNext = function() {
  return this.accuDistance < this.wayDistance;
}
