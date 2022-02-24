/*
---
MooTools: the javascript framework

web build:
 - http://mootools.net/more/5a43af4896378e7e2d2f641d0409995a

packager build:
 - packager build More/More More/Fx.Slide More/Slider More/Tips

copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/

MooTools.More={version:"1.5.1",build:"2dd695ba957196ae4b0275a690765d6636a61ccd"};Fx.Slide=new Class({Extends:Fx,options:{mode:"vertical",wrapper:false,hideOverflow:true,resetHeight:false},initialize:function(b,a){b=this.element=this.subject=document.id(b);
this.parent(a);a=this.options;var d=b.retrieve("wrapper"),c=b.getStyles("margin","position","overflow");if(a.hideOverflow){c=Object.append(c,{overflow:"hidden"});
}if(a.wrapper){d=document.id(a.wrapper).setStyles(c);}if(!d){d=new Element("div",{styles:c}).wraps(b);}b.store("wrapper",d).setStyle("margin",0);if(b.getStyle("overflow")=="visible"){b.setStyle("overflow","hidden");
}this.now=[];this.open=true;this.wrapper=d;this.addEvent("complete",function(){this.open=(d["offset"+this.layout.capitalize()]!=0);if(this.open&&this.options.resetHeight){d.setStyle("height","");
}},true);},vertical:function(){this.margin="margin-top";this.layout="height";this.offset=this.element.offsetHeight;},horizontal:function(){this.margin="margin-left";
this.layout="width";this.offset=this.element.offsetWidth;},set:function(a){this.element.setStyle(this.margin,a[0]);this.wrapper.setStyle(this.layout,a[1]);
return this;},compute:function(c,b,a){return[0,1].map(function(d){return Fx.compute(c[d],b[d],a);});},start:function(b,e){if(!this.check(b,e)){return this;
}this[e||this.options.mode]();var d=this.element.getStyle(this.margin).toInt(),c=this.wrapper.getStyle(this.layout).toInt(),a=[[d,c],[0,this.offset]],g=[[d,c],[-this.offset,0]],f;
switch(b){case"in":f=a;break;case"out":f=g;break;case"toggle":f=(c==0)?a:g;}return this.parent(f[0],f[1]);},slideIn:function(a){return this.start("in",a);
},slideOut:function(a){return this.start("out",a);},hide:function(a){this[a||this.options.mode]();this.open=false;return this.set([-this.offset,0]);},show:function(a){this[a||this.options.mode]();
this.open=true;return this.set([0,this.offset]);},toggle:function(a){return this.start("toggle",a);}});Element.Properties.slide={set:function(a){this.get("slide").cancel().setOptions(a);
return this;},get:function(){var a=this.retrieve("slide");if(!a){a=new Fx.Slide(this,{link:"cancel"});this.store("slide",a);}return a;}};Element.implement({slide:function(d,e){d=d||"toggle";
var b=this.get("slide"),a;switch(d){case"hide":b.hide(e);break;case"show":b.show(e);break;case"toggle":var c=this.retrieve("slide:flag",b.open);b[c?"slideOut":"slideIn"](e);
this.store("slide:flag",!c);a=true;break;default:b.start(d,e);}if(!a){this.eliminate("slide:flag");}return this;}});Class.Mutators.Binds=function(a){if(!this.prototype.initialize){this.implement("initialize",function(){});
}return Array.from(a).concat(this.prototype.Binds||[]);};Class.Mutators.initialize=function(a){return function(){Array.from(this.Binds).each(function(b){var c=this[b];
if(c){this[b]=c.bind(this);}},this);return a.apply(this,arguments);};};var Drag=new Class({Implements:[Events,Options],options:{snap:6,unit:"px",grid:false,style:true,limit:false,handle:false,invert:false,preventDefault:false,stopPropagation:false,compensateScroll:false,modifiers:{x:"left",y:"top"}},initialize:function(){var b=Array.link(arguments,{options:Type.isObject,element:function(c){return c!=null;
}});this.element=document.id(b.element);this.document=this.element.getDocument();this.setOptions(b.options||{});var a=typeOf(this.options.handle);this.handles=((a=="array"||a=="collection")?$$(this.options.handle):document.id(this.options.handle))||this.element;
this.mouse={now:{},pos:{}};this.value={start:{},now:{}};this.offsetParent=(function(d){var e=d.getOffsetParent();var c=!e||(/^(?:body|html)$/i).test(e.tagName);
return c?window:document.id(e);})(this.element);this.selection="selectstart" in document?"selectstart":"mousedown";this.compensateScroll={start:{},diff:{},last:{}};
if("ondragstart" in document&&!("FileReader" in window)&&!Drag.ondragstartFixed){document.ondragstart=Function.from(false);Drag.ondragstartFixed=true;}this.bound={start:this.start.bind(this),check:this.check.bind(this),drag:this.drag.bind(this),stop:this.stop.bind(this),cancel:this.cancel.bind(this),eventStop:Function.from(false),scrollListener:this.scrollListener.bind(this)};
this.attach();},attach:function(){this.handles.addEvent("mousedown",this.bound.start);if(this.options.compensateScroll){this.offsetParent.addEvent("scroll",this.bound.scrollListener);
}return this;},detach:function(){this.handles.removeEvent("mousedown",this.bound.start);if(this.options.compensateScroll){this.offsetParent.removeEvent("scroll",this.bound.scrollListener);
}return this;},scrollListener:function(){if(!this.mouse.start){return;}var a=this.offsetParent.getScroll();if(this.element.getStyle("position")=="absolute"){var b=this.sumValues(a,this.compensateScroll.last,-1);
this.mouse.now=this.sumValues(this.mouse.now,b,1);}else{this.compensateScroll.diff=this.sumValues(a,this.compensateScroll.start,-1);}if(this.offsetParent!=window){this.compensateScroll.diff=this.sumValues(this.compensateScroll.start,a,-1);
}this.compensateScroll.last=a;this.render(this.options);},sumValues:function(d,c,e){var b={},a=this.options;for(z in a.modifiers){if(!a.modifiers[z]){continue;
}b[z]=d[z]+c[z]*e;}return b;},start:function(a){var k=this.options;if(a.rightClick){return;}if(k.preventDefault){a.preventDefault();}if(k.stopPropagation){a.stopPropagation();
}this.compensateScroll.start=this.compensateScroll.last=this.offsetParent.getScroll();this.compensateScroll.diff={x:0,y:0};this.mouse.start=a.page;this.fireEvent("beforeStart",this.element);
var d=k.limit;this.limit={x:[],y:[]};var f,h,b=this.offsetParent==window?null:this.offsetParent;for(f in k.modifiers){if(!k.modifiers[f]){continue;}var c=this.element.getStyle(k.modifiers[f]);
if(c&&!c.match(/px$/)){if(!h){h=this.element.getCoordinates(b);}c=h[k.modifiers[f]];}if(k.style){this.value.now[f]=(c||0).toInt();}else{this.value.now[f]=this.element[k.modifiers[f]];
}if(k.invert){this.value.now[f]*=-1;}this.mouse.pos[f]=a.page[f]-this.value.now[f];if(d&&d[f]){var e=2;while(e--){var g=d[f][e];if(g||g===0){this.limit[f][e]=(typeof g=="function")?g():g;
}}}}if(typeOf(this.options.grid)=="number"){this.options.grid={x:this.options.grid,y:this.options.grid};}var j={mousemove:this.bound.check,mouseup:this.bound.cancel};
j[this.selection]=this.bound.eventStop;this.document.addEvents(j);},check:function(a){if(this.options.preventDefault){a.preventDefault();}var b=Math.round(Math.sqrt(Math.pow(a.page.x-this.mouse.start.x,2)+Math.pow(a.page.y-this.mouse.start.y,2)));
if(b>this.options.snap){this.cancel();this.document.addEvents({mousemove:this.bound.drag,mouseup:this.bound.stop});this.fireEvent("start",[this.element,a]).fireEvent("snap",this.element);
}},drag:function(b){var a=this.options;if(a.preventDefault){b.preventDefault();}this.mouse.now=this.sumValues(b.page,this.compensateScroll.diff,-1);this.render(a);
this.fireEvent("drag",[this.element,b]);},render:function(a){for(var b in a.modifiers){if(!a.modifiers[b]){continue;}this.value.now[b]=this.mouse.now[b]-this.mouse.pos[b];
if(a.invert){this.value.now[b]*=-1;}if(a.limit&&this.limit[b]){if((this.limit[b][1]||this.limit[b][1]===0)&&(this.value.now[b]>this.limit[b][1])){this.value.now[b]=this.limit[b][1];
}else{if((this.limit[b][0]||this.limit[b][0]===0)&&(this.value.now[b]<this.limit[b][0])){this.value.now[b]=this.limit[b][0];}}}if(a.grid[b]){this.value.now[b]-=((this.value.now[b]-(this.limit[b][0]||0))%a.grid[b]);
}if(a.style){this.element.setStyle(a.modifiers[b],this.value.now[b]+a.unit);}else{this.element[a.modifiers[b]]=this.value.now[b];}}},cancel:function(a){this.document.removeEvents({mousemove:this.bound.check,mouseup:this.bound.cancel});
if(a){this.document.removeEvent(this.selection,this.bound.eventStop);this.fireEvent("cancel",this.element);}},stop:function(b){var a={mousemove:this.bound.drag,mouseup:this.bound.stop};
a[this.selection]=this.bound.eventStop;this.document.removeEvents(a);this.mouse.start=null;if(b){this.fireEvent("complete",[this.element,b]);}}});Element.implement({makeResizable:function(a){var b=new Drag(this,Object.merge({modifiers:{x:"width",y:"height"}},a));
this.store("resizer",b);return b.addEvent("drag",function(){this.fireEvent("resize",b);}.bind(this));}});(function(){var b=function(e,d){var f=[];Object.each(d,function(g){Object.each(g,function(h){e.each(function(i){f.push(i+"-"+h+(i=="border"?"-width":""));
});});});return f;};var c=function(f,e){var d=0;Object.each(e,function(h,g){if(g.test(f)){d=d+h.toInt();}});return d;};var a=function(d){return !!(!d||d.offsetHeight||d.offsetWidth);
};Element.implement({measure:function(h){if(a(this)){return h.call(this);}var g=this.getParent(),e=[];while(!a(g)&&g!=document.body){e.push(g.expose());
g=g.getParent();}var f=this.expose(),d=h.call(this);f();e.each(function(i){i();});return d;},expose:function(){if(this.getStyle("display")!="none"){return function(){};
}var d=this.style.cssText;this.setStyles({display:"block",position:"absolute",visibility:"hidden"});return function(){this.style.cssText=d;}.bind(this);
},getDimensions:function(d){d=Object.merge({computeSize:false},d);var i={x:0,y:0};var h=function(j,e){return(e.computeSize)?j.getComputedSize(e):j.getSize();
};var f=this.getParent("body");if(f&&this.getStyle("display")=="none"){i=this.measure(function(){return h(this,d);});}else{if(f){try{i=h(this,d);}catch(g){}}}return Object.append(i,(i.x||i.x===0)?{width:i.x,height:i.y}:{x:i.width,y:i.height});
},getComputedSize:function(d){d=Object.merge({styles:["padding","border"],planes:{height:["top","bottom"],width:["left","right"]},mode:"both"},d);var g={},e={width:0,height:0},f;
if(d.mode=="vertical"){delete e.width;delete d.planes.width;}else{if(d.mode=="horizontal"){delete e.height;delete d.planes.height;}}b(d.styles,d.planes).each(function(h){g[h]=this.getStyle(h).toInt();
},this);Object.each(d.planes,function(i,h){var k=h.capitalize(),j=this.getStyle(h);if(j=="auto"&&!f){f=this.getDimensions();}j=g[h]=(j=="auto")?f[h]:j.toInt();
e["total"+k]=j;i.each(function(m){var l=c(m,g);e["computed"+m.capitalize()]=l;e["total"+k]+=l;});},this);return Object.append(e,g);}});})();var Slider=new Class({Implements:[Events,Options],Binds:["clickedElement","draggedKnob","scrolledElement"],options:{onTick:function(a){this.setKnobPosition(a);
},initialStep:0,snap:false,offset:0,range:false,wheel:false,steps:100,mode:"horizontal"},initialize:function(f,a,e){this.setOptions(e);e=this.options;this.element=document.id(f);
a=this.knob=document.id(a);this.previousChange=this.previousEnd=this.step=e.initialStep?e.initialStep:e.range?e.range[0]:0;var b={},d={x:false,y:false};
switch(e.mode){case"vertical":this.axis="y";this.property="top";this.offset="offsetHeight";break;case"horizontal":this.axis="x";this.property="left";this.offset="offsetWidth";
}this.setSliderDimensions();this.setRange(e.range,null,true);if(a.getStyle("position")=="static"){a.setStyle("position","relative");}a.setStyle(this.property,-e.offset);
d[this.axis]=this.property;b[this.axis]=[-e.offset,this.full-e.offset];var c={snap:0,limit:b,modifiers:d,onDrag:this.draggedKnob,onStart:this.draggedKnob,onBeforeStart:(function(){this.isDragging=true;
}).bind(this),onCancel:function(){this.isDragging=false;}.bind(this),onComplete:function(){this.isDragging=false;this.draggedKnob();this.end();}.bind(this)};
if(e.snap){this.setSnap(c);}this.drag=new Drag(a,c);if(e.initialStep!=null){this.set(e.initialStep,true);}this.attach();},attach:function(){this.element.addEvent("mousedown",this.clickedElement);
if(this.options.wheel){this.element.addEvent("mousewheel",this.scrolledElement);}this.drag.attach();return this;},detach:function(){this.element.removeEvent("mousedown",this.clickedElement).removeEvent("mousewheel",this.scrolledElement);
this.drag.detach();return this;},autosize:function(){this.setSliderDimensions().setKnobPosition(this.toPosition(this.step));this.drag.options.limit[this.axis]=[-this.options.offset,this.full-this.options.offset];
if(this.options.snap){this.setSnap();}return this;},setSnap:function(a){if(!a){a=this.drag.options;}a.grid=Math.ceil(this.stepWidth);a.limit[this.axis][1]=this.element[this.offset];
return this;},setKnobPosition:function(a){if(this.options.snap){a=this.toPosition(this.step);}this.knob.setStyle(this.property,a);return this;},setSliderDimensions:function(){this.full=this.element.measure(function(){this.half=this.knob[this.offset]/2;
return this.element[this.offset]-this.knob[this.offset]+(this.options.offset*2);}.bind(this));return this;},set:function(a,b){if(!((this.range>0)^(a<this.min))){a=this.min;
}if(!((this.range>0)^(a>this.max))){a=this.max;}this.step=(a).round(this.modulus.decimalLength);if(b){this.checkStep().setKnobPosition(this.toPosition(this.step));
}else{this.checkStep().fireEvent("tick",this.toPosition(this.step)).fireEvent("move").end();}return this;},setRange:function(b,d,c){this.min=Array.pick([b[0],0]);
this.max=Array.pick([b[1],this.options.steps]);this.range=this.max-this.min;this.steps=this.options.steps||this.full;var a=this.stepSize=Math.abs(this.range)/this.steps;
this.stepWidth=this.stepSize*this.full/Math.abs(this.range);this.setModulus();if(b){this.set(Array.pick([d,this.step]).limit(this.min,this.max),c);}return this;
},setModulus:function(){var a=((this.stepSize+"").split(".")[1]||[]).length,b=1+"";while(a--){b+="0";}this.modulus={multiplier:(b).toInt(10),decimalLength:b.length-1};
},clickedElement:function(c){if(this.isDragging||c.target==this.knob){return;}var b=this.range<0?-1:1,a=c.page[this.axis]-this.element.getPosition()[this.axis]-this.half;
a=a.limit(-this.options.offset,this.full-this.options.offset);this.step=(this.min+b*this.toStep(a)).round(this.modulus.decimalLength);this.checkStep().fireEvent("tick",a).fireEvent("move").end();
},scrolledElement:function(a){var b=(this.options.mode=="horizontal")?(a.wheel<0):(a.wheel>0);this.set(this.step+(b?-1:1)*this.stepSize);a.stop();},draggedKnob:function(){var b=this.range<0?-1:1,a=this.drag.value.now[this.axis];
a=a.limit(-this.options.offset,this.full-this.options.offset);this.step=(this.min+b*this.toStep(a)).round(this.modulus.decimalLength);this.checkStep();
this.fireEvent("move");},checkStep:function(){var a=this.step;if(this.previousChange!=a){this.previousChange=a;this.fireEvent("change",a);}return this;
},end:function(){var a=this.step;if(this.previousEnd!==a){this.previousEnd=a;this.fireEvent("complete",a+"");}return this;},toStep:function(a){var b=(a+this.options.offset)*this.stepSize/this.full*this.steps;
return this.options.steps?(b-(b*this.modulus.multiplier)%(this.stepSize*this.modulus.multiplier)/this.modulus.multiplier).round(this.modulus.decimalLength):b;
},toPosition:function(a){return(this.full*Math.abs(this.min-a))/(this.steps*this.stepSize)-this.options.offset||0;}});(function(){var a=function(c,b){return(c)?(typeOf(c)=="function"?c(b):b.get(c)):"";
};this.Tips=new Class({Implements:[Events,Options],options:{onShow:function(){this.tip.setStyle("display","block");},onHide:function(){this.tip.setStyle("display","none");
},title:"title",text:function(b){return b.get("rel")||b.get("href");},showDelay:100,hideDelay:100,className:"tip-wrap",offset:{x:16,y:16},windowPadding:{x:0,y:0},fixed:false,waiAria:true},initialize:function(){var b=Array.link(arguments,{options:Type.isObject,elements:function(c){return c!=null;
}});this.setOptions(b.options);if(b.elements){this.attach(b.elements);}this.container=new Element("div",{"class":"tip"});if(this.options.id){this.container.set("id",this.options.id);
if(this.options.waiAria){this.attachWaiAria();}}},toElement:function(){if(this.tip){return this.tip;}this.tip=new Element("div",{"class":this.options.className,styles:{position:"absolute",top:0,left:0}}).adopt(new Element("div",{"class":"tip-top"}),this.container,new Element("div",{"class":"tip-bottom"}));
return this.tip;},attachWaiAria:function(){var b=this.options.id;this.container.set("role","tooltip");if(!this.waiAria){this.waiAria={show:function(c){if(b){c.set("aria-describedby",b);
}this.container.set("aria-hidden","false");},hide:function(c){if(b){c.erase("aria-describedby");}this.container.set("aria-hidden","true");}};}this.addEvents(this.waiAria);
},detachWaiAria:function(){if(this.waiAria){this.container.erase("role");this.container.erase("aria-hidden");this.removeEvents(this.waiAria);}},attach:function(b){$$(b).each(function(d){var f=a(this.options.title,d),e=a(this.options.text,d);
d.set("title","").store("tip:native",f).retrieve("tip:title",f);d.retrieve("tip:text",e);this.fireEvent("attach",[d]);var c=["enter","leave"];if(!this.options.fixed){c.push("move");
}c.each(function(h){var g=d.retrieve("tip:"+h);if(!g){g=function(i){this["element"+h.capitalize()].apply(this,[i,d]);}.bind(this);}d.store("tip:"+h,g).addEvent("mouse"+h,g);
},this);},this);return this;},detach:function(b){$$(b).each(function(d){["enter","leave","move"].each(function(e){d.removeEvent("mouse"+e,d.retrieve("tip:"+e)).eliminate("tip:"+e);
});this.fireEvent("detach",[d]);if(this.options.title=="title"){var c=d.retrieve("tip:native");if(c){d.set("title",c);}}},this);return this;},elementEnter:function(c,b){clearTimeout(this.timer);
this.timer=(function(){this.container.empty();["title","text"].each(function(e){var d=b.retrieve("tip:"+e);var f=this["_"+e+"Element"]=new Element("div",{"class":"tip-"+e}).inject(this.container);
if(d){this.fill(f,d);}},this);this.show(b);this.position((this.options.fixed)?{page:b.getPosition()}:c);}).delay(this.options.showDelay,this);},elementLeave:function(c,b){clearTimeout(this.timer);
this.timer=this.hide.delay(this.options.hideDelay,this,b);this.fireForParent(c,b);},setTitle:function(b){if(this._titleElement){this._titleElement.empty();
this.fill(this._titleElement,b);}return this;},setText:function(b){if(this._textElement){this._textElement.empty();this.fill(this._textElement,b);}return this;
},fireForParent:function(c,b){b=b.getParent();if(!b||b==document.body){return;}if(b.retrieve("tip:enter")){b.fireEvent("mouseenter",c);}else{this.fireForParent(c,b);
}},elementMove:function(c,b){this.position(c);},position:function(f){if(!this.tip){document.id(this);}var c=window.getSize(),b=window.getScroll(),g={x:this.tip.offsetWidth,y:this.tip.offsetHeight},d={x:"left",y:"top"},e={y:false,x2:false,y2:false,x:false},h={};
for(var i in d){h[d[i]]=f.page[i]+this.options.offset[i];if(h[d[i]]<0){e[i]=true;}if((h[d[i]]+g[i]-b[i])>c[i]-this.options.windowPadding[i]){h[d[i]]=f.page[i]-this.options.offset[i]-g[i];
e[i+"2"]=true;}}this.fireEvent("bound",e);this.tip.setStyles(h);},fill:function(b,c){if(typeof c=="string"){b.set("html",c);}else{b.adopt(c);}},show:function(b){if(!this.tip){document.id(this);
}if(!this.tip.getParent()){this.tip.inject(document.body);}this.fireEvent("show",[this.tip,b]);},hide:function(b){if(!this.tip){document.id(this);}this.fireEvent("hide",[this.tip,b]);
}});})();