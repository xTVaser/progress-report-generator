/**	
	author		HitkoDev
	copyright	Copyright (C) 2014 HitkoDev All Rights Reserved.
	@license	http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
	Website		http://hitko.eu/software/videobox
	Based on Slimbox 2.04 
		(c) 2007-2010 Christophe Beyls <http://www.digitalia.be>
		MIT-style license.
*/

// To call events listener after the event
var waitForFinalEvent=(function(){var a={};return function(d,b,c){if(!c){c="Don't call this twice without a uniqueId"}if(a[c]){clearTimeout(a[c])}a[c]=setTimeout(d,b)}})();

// Videobox player (lightbox) effect
(function vb(f){var e=f(window),k,z=-1,b,c,y,o,l,i=!window.XMLHttpRequest,n=[],x=document.documentElement,d=defaults={overlayOpacity:0.8,overlayFadeDuration:400,resizeDuration:400,resizeEasing:"swing",videoWidth:640,videoHeight:363,captionAnimationDuration:400},r,w,q,v,j,s,a;f(function g(){f("body").append(f([r=f('<div id="vbOverlay" />').click(f.vb_close)[0],w=f('<div id="vbCenter" />')[0],v=f('<div id="vbBottomContainer" />')[0]]).css("display","none"));q=f('<iframe id="vbVideo" frameborder="0" allowfullscreen="true" oallowfullscreen msallowfullscreen webkitallowfullscreen mozallowfullscreen />').appendTo(w)[0];j=f('<div id="vbBottom" />').appendTo(v).append([a=f('<a id="vbCloseLink" href="#" />').click(f.vb_close)[0],s=f('<div id="vbCaption" />')[0],f('<div style="clear: both;" />')[0]])[0]});f.videobox=function(C,B,A){d=f.extend(defaults,A);if(typeof C=="string"){C=[[C,B]];B=0}f.vbi_close();f.cfr_close();o=0;l=0;y=e.scrollTop()+(e.height()/2);f(w).css({top:Math.max(0,y-(l/2)),width:o,height:l,marginLeft:-o/2}).show();c=i||(r.currentStyle&&(r.currentStyle.position!="fixed"));if(c){r.style.position="absolute"}f(r).css("opacity",d.overlayOpacity).fadeIn(d.overlayFadeDuration);u();m(1);k=C;z=B;b=k[z][0];p();h();return false};f.vb_close=function(){if(z>=0){p();z=-1;f(w).hide();f(r).stop().fadeOut(d.overlayFadeDuration,m)}return false};f.fn.videobox=function(B,F,D){F=F||function A(G){return[G.href,G.getAttribute("title"),G.getAttribute("data-videowidth"),G.getAttribute("data-videoheight")]};D=D||function E(){return true};var C=this;return C.unbind("click").click(function E(){var I=this,K=0,J,G=0,H;J=f.grep(C,function(M,L){return D.call(I,M,L)});for(H=J.length;G<H;++G){if(J[G]==I){K=G}J[G]=F(J[G],G)}return f.videobox(J,K,B)})};function u(){var B=e.scrollLeft(),A=e.width();f([w,v]).css("left",B+(A/2));if(c){f(r).css({left:B,top:e.scrollTop(),width:A,height:e.height()})}}function m(A){if(A){f("object").add(i?"select":"embed").each(function(C,D){n[C]=[D,D.style.visibility];D.style.visibility="hidden"})}else{f.each(n,function(C,D){D[0].style.visibility=D[1]});n=[]}var B=A?"bind":"unbind";e[B]("scroll resize",u)}function h(B){w.className="";var C=k[z][2]||d.videoWidth;var A=k[z][3]||d.videoHeight;if(C>(e.width()-20)){C=e.width()-20}A=(A*C)/(k[z][2]||d.videoWidth);if(A>(e.height()-20)){A=e.height()-20}f(s).html(k[z][1]||"");f(q).css({display:""});o=parseInt(C);l=parseInt(A);f(v).css({width:o,marginLeft:-10-o/2,display:"",visibility:"hidden"});y=e.scrollTop()+(e.height()/2);var D=Math.max(0,y-5-((l+v.offsetHeight)/2),y-10-l);f(v).css({top:D+l});f(w).animate({height:l,width:o,top:D,marginLeft:-10-o/2},d.resizeDuration,d.resizeEasing,function(){t();if(B==undefined){q.src=b}})}function t(){f(j).css("marginTop",-j.offsetHeight).animate({marginTop:0},d.captionAnimationDuration);v.style.visibility=""}function p(){f([w,q,j]).stop(true);f([q,v]).hide();q.src="";q.title=""}f(window).on("resize",function(){waitForFinalEvent(function(){if(z>=0){h(true)}},500,"videobox")})})(jQuery);

// Inline player (no-lightbox) effect
(function vbi(i){var h=i(window),m,v=-1,e,k=!window.XMLHttpRequest,o=[],g=defaults={resizeDuration:400,resizeEasing:"swing",videoWidth:640,videoHeight:363},q,c,r,s,b,p,t,n,a;a="";i(function u(){i("body").append([q=i('<div id="vbiHidden" />').css("display","none")[0]]);p=i('<div id="vbiPlayer" />').appendTo(q).append([b=i('<a id="vbiCloseLink" href="#" />').click(i.vbi_close)[0],n=i('<div id="vbiPadding" />')[0],s=i('<div id="vbiCaption" />')[0]])[0];t=i('<div id="vbiVideoCont" />').appendTo(n).append([c=i('<img id="vbiSizer" />')[0],r=i('<iframe id="vbiVideo" frameborder="0" allowfullscreen="true" oallowfullscreen msallowfullscreen webkitallowfullscreen mozallowfullscreen />')[0]])[0]});i.vbinline=function(y,x,w){g=i.extend(defaults,w);if(typeof y=="string"){y=[[y,x]];x=0}i.vb_close();i.cfr_close();d(1);m=y;return l(x)};i.vbi_close=function(){if(v>=0){j();v=-1}i(b).show();i(b).click(i.vbi_close);return false};i.fn.vbinline=function(w,B,A){B=B||function z(C){return[C.href,C.getAttribute("title"),C.getAttribute("data-videowidth"),C.getAttribute("data-videoheight"),i(C),C.getAttribute("data-videosizer")]};A=A||function y(){return true};var x=this;return x.unbind("click").click(function y(){var E=this,G=0,F,C=0,D;F=i.grep(x,function(I,H){return A.call(E,I,H)});for(D=F.length;C<D;++C){if(F[C]==E){G=C}F[C]=B(F[C],C)}return i.vbinline(F,G,w)})};function d(w){if(w){i("object").add(k?"select":"embed").each(function(x,y){o[x]=[y,y.style.visibility];y.style.visibility="hidden"})}else{i.each(o,function(x,y){y[0].style.visibility=y[1]});o=[]}}function l(w){if(w>=0){v=w;e=m[v][0];j();f()}return false}function f(){t.className="";c.src="";var x=m[v][4].width();i(t).width(x);i(s).html(m[v][1]||"");a=m[v][4];i(p).insertAfter(m[v][4]);var y=m[v][2]||g.videoWidth;var w=m[v][3]||g.videoHeight;r.src=e;i(r).css({display:""});i(s).html(m[v][1]||"");m[v][4].css({display:"none"});if(m[v][5]!=null){c.src=m[v][5];t.className="vb_videoSizer";i(t).animate({width:y},g.resizeDuration,g.resizeEasing)}else{if(y>(h.width()-10)){y=h.width()-10}w=(w*y)/(m[v][2]||g.videoWidth);if(w>(h.height()-10)){w=h.height()-10}y=parseInt(y)+10;w=parseInt(w);i(t).animate({width:y,height:w},g.resizeDuration,g.resizeEasing)}}function j(){if(a!=""){a.css({display:""})}a="";i(p).appendTo(q);i([r]).stop(true);i([r]).hide();r.src="";r.title=""}})(jQuery);

jQuery(function vb($) {
	
	// AUTOLOAD FOR VIDEOBOX
	$("a[rel^='videobox']").videobox({ /* Put custom options here */ }, function vbl(el) {
		return [el.href, el.getAttribute("title"), el.getAttribute("data-videowidth"), el.getAttribute("data-videoheight")];
	}, function vbl(el) {
		return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
	});
	
	// AUTOLOAD FOR INLINE PLAYER
	$("a[rel^='vbinline']").vbinline({ /* Put custom options here */ }, function vbil(el) {
		return [el.href, el.getAttribute("title"), el.getAttribute("data-videowidth"), el.getAttribute("data-videoheight"), $(el), el.getAttribute("data-videosizer")];
	}, function vbil(el) {
		return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
	});
	
});