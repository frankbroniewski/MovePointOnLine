// needs turfjs to operate

function PointOnLineIterator( way, travelTime ) {

  this.way = way;
  this.wayDistance = turf.lineDistance( this.way );
  this.accuDistance = 0;
  this.travelTime = travelTime;

  this.currentLineSegment;
  this.currentLineSegmentIndex = 0;
  this.segments = [];
  this.numSegments;

  this.fps = 1000 / 60;

  this._setupSegments();

}


PointOnLineIterator.prototype.next = function() {

  var segment = this.currentLineSegment,
      point;

  if ( segment.accuDistance < segment.distance ) {

    return this._getNextPoint( segment );

  } else {

    console.error( segment.accuDistance, segment.distance );
    throw new Error( 'segment distance overflow' );
    return;

    //
    // this.currentLineSegmentIndex++;
    // this.accuDistance = this.accuDistance + segment.stepLength;
    //
    // if ( this.currentLineSegmentIndex < this.numSegments - 1 ) {
    //
    //   console.log( 'Changing segment', this.currentLineSegmentIndex );
    //   this.currentLineSegment = this.segments[ this.currentLineSegmentIndex ];
    //   console.log(this.currentLineSegment);
    //
    //   return this._getNextPoint( this.currentLineSegment );
    //
    // } else {
    //
    //   console.warn( 'segment index out of range', this );
    //
    //   return false
    // }

  }

  return false;

}


PointOnLineIterator.prototype._getNextPoint = function ( segment ) {

  var point = turf.along(segment.segment, segment.accuDistance, 'kilometers');
  segment.accuDistance = segment.accuDistance + segment.stepLength;
  this.accuDistance = this.accuDistance + segment.stepLength;
  return point;

}


PointOnLineIterator.prototype.hasNext = function() {

  return this.accuDistance < this.wayDistance;

}


PointOnLineIterator.prototype._setupSegments = function() {

  var coordinates = this.way.features[ 0 ].geometry.coordinates;

  for ( var i = 0, len = coordinates.length; i < len - 1; i++ ) {

    var segment = turf.lineString([ coordinates[i], coordinates[i + 1] ]),
        segmentDistance = turf.lineDistance( segment ),
        segmentRatio = segmentDistance / this.wayDistance,
        segmentTravelTime = this.travelTime * segmentRatio,
        stepLength = segmentDistance / segmentTravelTime * this.fps;

    this.segments.push({
      'segment': segment,
      'distance': segmentDistance,
      'ratio': segmentRatio,
      'travelTime': segmentTravelTime,
      'stepLength': stepLength,
      'accuDistance': 0
    });

  }

  this.currentLineSegment = this.segments[ 0 ];
  this.numSegments = this.segments.length;

}
