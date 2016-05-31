var slideArray = [
	"rise-and-fall.svg"
];

var boxColors = ["#ea4a21", "#852919", "#46872a", "#30a1c7", "#6b2f55", "#095628", "#472aaa", "#d85962", "#a01183", "#22598d", "#671126", "#4e48d9", "#00a100"];


/*
usage:
 <script id="slideshowLibrary" xlink:href="svg-slides.js" type="text/ecmascript"/>
instructions:
 
 * right/left arrow keys move to next/previous slide
 * down arrow key steps forward through bullets
 * up arrow key steps backward through bullets
 * shift+t shows ToC
*/

var svgns = "http://www.w3.org/2000/svg";


var ai = -1;
var bulletArray = [];

window.onload = function(evt) {
  var content = document.getElementById("content");
  if (content) {
    var allElements = content.getElementsByTagName("*");
    for (var i = 0, iLen = allElements.length; iLen > i; i++) {
      var eachEl = allElements[i];
      var bulletClass = eachEl.getAttribute("class");
      if ( bulletClass && -1 != bulletClass.indexOf("bullet") ) {
        bulletArray.push(eachEl);
        if ("http://www.w3.org/1999/xhtml" === eachEl.namespaceURI) {
          eachEl.setAttribute("style", "visibility:hidden");
        } else {
          eachEl.setAttribute("visibility", "hidden");
        }
      }
    }
  
    if ( "http://www.w3.org/2000/svg" === content.namespaceURI ) {
      for (var t = 0, tLen = bulletArray.length; tLen > t; t++) {
        var eachBullet = bulletArray[t];
        var bulletClass = eachBullet.getAttribute("class");
        if ( bulletClass && "g" == eachBullet.localName && -1 != bulletClass.indexOf("colorbox") ) {
          createBox( eachBullet );
        }
      }
    }
  }  
}


document.onkeydown = function(evt) {
  var keyCode = null;
  if (!evt)
  evt = window.event;

  if (window.event) {
    keyCode = window.event.keyCode;
  }
  else if (evt.which) {
    keyCode = evt.which;
  }
  else {
    return true;
  }

  if (37 == keyCode || 39 == keyCode) {
    changeSlide( keyCode );
  }
  else if (40 == keyCode) {
    stepForward();
  }
  else if (38 == keyCode) {
    stepBackward();
  }
  else if (84 == keyCode) {
    // 't' key
    if (evt && evt.shiftKey) {
      window.location = "toc.html";
    }
  }
}


function stepForward() {
  // hide "remove" bullets for replacement content
  var lastBullet = bulletArray[ai];
  if ( lastBullet ) {
    var c = lastBullet.getAttribute("class");
    var ri = c.indexOf("remove");
    if ( -1 != ri ) {
      var removalIndex = parseInt(c.substr(ri).split(" ")[0].split("-")[1]);
      // alert(removalIndex + " " + ai)
      if ( isNaN(removalIndex) ||  ai >= removalIndex ) {
        // alert("foo")
        lastBullet.setAttribute("style", "visibility:hidden");
      }
    }
  }

  for (var b = 0, bLen = bulletArray.length; bLen > b; b++) {
    var eachBullet = bulletArray[b];
    var bulletClass = eachBullet.getAttribute("class");
    var ri = bulletClass.indexOf("remove");
    var removalIndex = parseInt(bulletClass.substr(ri).split(" ")[0].split("-")[1]);
    if ( false == isNaN(removalIndex) && ai >= removalIndex ) {
      eachBullet.setAttribute("style", "visibility:hidden");
    }
  }

  ai++;
  if (bulletArray.length - 1 <= ai) {
    ai = bulletArray.length -1;
  }
  
  var bullet = bulletArray[ai];
  if (!bullet) { return true; }
  // TODO IE
  bullet.setAttribute("style", "visibility:visible");
  
  var bulletClass = bullet.getAttribute("class");
  var ani = bulletClass.indexOf("animate");
  if ( -1 != ani ) {
    var bulletEls = bullet.getElementsByTagName("*");
    for (var b = 0, bLen = bulletEls.length; bLen > b; b++) {
      var eachEl = bulletEls[b];
      if ( eachEl.beginElement ) {
        eachEl.beginElement();
      }
      // var isAnimation = eachEl.getAttribute("class").indexOf("animate");
      // if ( -1 != ani ) {
      //   eachEl.beginElement();
      // }
    }
  }
}


function stepBackward() {
  var bullet = bulletArray[ai];
  if (!bullet) { return true; }
  // @@TODO IE
  bullet.setAttribute("style", "visibility:hidden");
  
  ai--;
  if (-1 > ai) {
    ai = -1;
  }

  // show "remove" bullets for replacement content
  var prevBullet = bulletArray[ai];
  if ( prevBullet && -1 != prevBullet.getAttribute("class").indexOf("remove") ) {
    prevBullet.setAttribute("style", "visibility:visible");
  }
}


function changeSlide( keyCode ) {
  var loc = window.location.href;
  var file = loc.split("/").pop();
  var newfile = slideArray[0];

  if (file === "") {
    file = "Overview.html";
  }

  for (var fi = 0, fiLen = slideArray.length; fiLen > fi; fi++) {
    var eachSlide = slideArray[fi];
    if (file == eachSlide) {
      var ni = fi;
      switch (keyCode) {
        case 37:
          // left
          ni--;
          if (0 > ni) {
            ni = slideArray.length - 1;
          }
          break;
          
        case 39:
          // right
          ni++;
          if (slideArray.length <= ni) {
            ni = 0;
          }
          break;
      }
      newfile = slideArray[ni];
    }
  }
  window.location = newfile;
}

function fade() {
}

function toc() {
  var toc = document.getElementById("toc");

  for (var fi = 0, fiLen = slideArray.length; fiLen > fi; fi++) {
    var eachSlide = slideArray[fi];
    var li = document.createElement("LI");
    var a = document.createElement("A");

    var file_name = eachSlide.split(".")[0];

    a.appendChild(document.createTextNode(file_name));
    a.setAttribute("href", eachSlide);
    li.appendChild(a);
    toc.appendChild(li);
  }
}

/*
 colorbox bullets extension
*/
function createBox( bulletEl ) {
  var bbox = bulletEl.getBBox();
  var x = [];
  var y = [];
  x[0] = bbox.x - randomNum( -3, 20);
  y[0] = bbox.y - randomNum( -3, 20);
  x[1] = Number(bbox.x + bbox.width) + randomNum( -3, 20);
  y[1] = bbox.y - randomNum( -3, 20);
  x[2] = Number(bbox.x + bbox.width) + randomNum( -3, 20);
  y[2] = Number(bbox.y + bbox.height) + randomNum( -3, 20);
  x[3] = bbox.x - randomNum( -3, 20);
  y[3] = Number(bbox.y + bbox.height) + randomNum( -3, 20);

  var points = x[0] + "," + y[0] + " " + x[1] + "," + y[1] + " " + x[2] + "," + y[2] + " " + x[3] + "," + y[3];

  var colorIndex = randomNum(0, boxColors.length - 1);
  var color = boxColors[ colorIndex ];
  boxColors.splice( colorIndex, 1);
  
  var box = document.createElementNS(svgns, "polygon" );
  box.setAttribute( "points", points );
  box.setAttribute( "fill", color );
  // box.setAttribute( "fill", "rgb(" + randomNum(0, 255) + "," + randomNum(0, 255) + "," + randomNum(0, 255) + ")" );

  bulletEl.insertBefore( box, bulletEl.firstChild );

}

//generates a quasi-random number in the ranges between the two parameters
randomNum.today = new Date();
randomNum.seed = randomNum.today.getTime();
function randomNum(min, max) {
  var range = Number(max) - Number(min);
  var offset = 0;
  if (0 == min) {
    range = max + 1;
    offset = 1;
  }
  else if (0 > min) {
    range += 1;
    offset = 1;
  }
  randomNum.seed = (randomNum.seed * 9301 + 49297) % 233280;
  var result = Math.ceil(randomNum.seed / (233280.0) * range);
  return Number(result) + Number(min) - Number(offset);
};

