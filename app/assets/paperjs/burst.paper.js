
var center = new Point(1800,2100);
var fill = new Path.Rectangle(new Rectangle(new Point(0, 0), new Size(4096, 4096) ));
fill.remove();
// fill.fillColor = 'black';

var pathObject = {
	children:[fill],
	fillColor: '#dbd3be'
}


function drawSetOfLines(centerPt, angleInc, startAngle, startDist){
	var angle = startAngle;
	for(var i=0, l=Math.floor(360/angleInc); i<l; i++){
		drawLines(centerPt, startDist, angle);
		angle += angleInc;
	}
}

function drawLines(centerPt, startDist, angle){
	var distance = startDist;
	var width = 5;
	var widthInc = 2;
	var widthMax = 30;

	while(checkPoint(centerPt+new Point(distance, 0))){
		var length = randInt(50, 250);
		var path = new Path.Rectangle(
			new Rectangle(centerPt+new Point(distance, -width/2), new Size(length, width) ), 
			new Size(width/2, width/2)
		);
		path.pivot = centerPt;
		path.rotate(angle);
		path.reverse();
		pathObject.children.push(path);

		// var result = fill.subtract(path, {insert:true});
		// fill.selected = true;
		// fill.remove();
		path.remove();

		// fill = result;

		// path.fillColor = 'black';
		distance += length + randInt(60, 100);
		width = Math.min(widthMax, width+widthInc);
	}
}

function checkPoint(pt){
	if(pt.x < 0 || pt.x > 4096 || pt.y < 0 || pt.y > 5096 ){
		return false;
	}
	return true;
}


function randInt(min, max){
	return min+Math.floor(Math.random()*(1+max-min))
}

drawSetOfLines(center, 30, 0, 20);
drawSetOfLines(center, 30, 15, 120);
drawSetOfLines(center, 15, 7.5, 240);
drawSetOfLines(center, 7.5, 3.75, 480);
drawSetOfLines(center, 3.75, 1.875, 960);

// fill.fillColor = 'black';

var masterPath = new CompoundPath(pathObject);
// masterPath.subtract(new Path.Rectangle(new Rectangle(new Point(0, 0), new Size(4096, 1500))));
// masterPath.remove = true;
// masterPath.selected = true;

// var mask = new Path.Rectangle(new Rectangle(new Point(0, 785), new Size(4096, 4096)));
var mask = new Path({
    // segments: [[0, 785], [4096, 785], [4096, 1989], [1079, 1989], [1079, 2122], [1725, 2122], [1725, 3573], [0, 3573]],
    segments: [[0, 785], [4096, 785], [4096, 1989], [1079, 1989], [1079, 2122], [1079, 3573], [0, 3573]],
    fillColor: 'black',
    closed: true
});
var group = new Group(mask, masterPath);
group.clipped = true;

// fill.subtract(masterPath);

// var rectangle = new Rectangle(new Point(50, 50), new Point(150, 100));
// var cornerSize = new Size(20, 20);
// var path = new Path.RoundRectangle(rectangle, cornerSize);
// path.fillColor = 'black';