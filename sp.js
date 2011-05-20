(function(window,document){
  "use strict";
  var body = document.body,
      colorBox = document.getElementById('sp-colorBox'),
      scrollHeight = Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight),
      h = 0, s=0, l=0,
      changing = false,
      ua = navigator.userAgent.toLowerCase(),
      isFirefox = (!!ua.match("gecko") && !ua.match("khtml")),
      isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]',
      addEvent, hsl2hex, wheelDelta;
      
  addEvent = function(c,a,h){
    function d(e){h.apply(c,[e||window.event]);}
    if(c.addEventListener){c.addEventListener(a,d,0);}
    else if(c.attachEvent){c.attachEvent("on"+a,d);}
  };

  hsl2hex = (function(){
    function hue2rgb(v1,v2,h){
      if(h<0){ h+=1;}
      if(h>1){ h-=1;}
      if((6*h)<1){ return (v1+(v2-v1)*6*h);}
      if((2*h)<1){ return (v2);}
      if((3*h)<2){ return (v1+(v2-v1)*((2/3-h)*6));}
      return v1;
    }
    return function hsl2hex(h,s,l){
      var r, g, b, v1, v2;
      h /= 360; s /= 100; l /= 100;
      if(s === 0){
        r = g = b = l*255;
      }else{
        v2 = (l < 0.5) ? (l*(1+s)):((l+s)-(s*l));
        v1 = 2*l - v2;
        r = 255 * hue2rgb(v1,v2,h+(1/3));
        g = 255 * hue2rgb(v1,v2,h);
        b = 255 * hue2rgb(v1,v2,h-(1/3));
      }
      r = Math.round(r).toString(16);
      r = r.length === 2?r:'0'+r;
      g = Math.round(g).toString(16);
      g = g.length === 2?g:'0'+g;
      b = Math.round(b).toString(16);
      b = b.length === 2?b:'0'+b;
      return ["#",r,g,b].join('').toLowerCase();
    };
  }());

  function updateColor(){
    body.style.backgroundColor = colorBox.innerHTML = hsl2hex(h,s,l);
  }

  addEvent(window,"keydown",function(e){changing = true;});
  addEvent(window,"keyup",function(e){changing = false;});

  function handleScroll(e){
    e = e||window.event;
    if(changing){
      wheelDelta = 0;
      if(e.detail){ wheelDelta = -e.detail/3;
      }else if(e.wheelDelta){
        wheelDelta = e.wheelDelta/120;
        if(isOpera){wheelDelta = -wheelDelta;}
      }
      if(wheelDelta){
        h = ((h += wheelDelta*7) < 0 ? 360+h:h) % 360;
        updateColor();
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;        
      }
    }
  }
  if(document.addEventListener){document.addEventListener(isFirefox ? "DOMMouseScroll" : "mousewheel",handleScroll,0);}
  else if(document.attachEvent){document.attachEvent("onmousewheel",handleScroll);}
  else if(document.onmousewheel){document.onmousewheel = handleScroll;}

  addEvent(window,"mousemove",function(e){
    s = 100 - parseInt(100 * e.clientY/window.innerHeight,10);
    l = 100 - parseInt(100 * e.clientX/(window.innerWidth-24),10);
    if(changing){ updateColor();}
  });
  
  colorBox.innerHTML = body.style.backgroundColor||"#ffffff";
}(window,document));