# jQuery.cuteScroll 1.0
Responsive jQuery y-axis scroll plugin that supports touches, swipes, mouse events.
Does not support overlapping elemens scrolling.

### Installation
```html
<script src="jquery.cutescroll.min.js"></script>
```
### Configuration
```javascript
jQuery.cuteScroll.defaults={
	barColor:'black',// bar default color
	barHeight:false,// if has a value, won't be dynamically changed
	barWidth:false,// if empty, uses scrollerWidth
	barMinHeight:'6rem',
	barMaxHeight:'auto',
	barOpacity:0.4,
	barBorderRadius:'1rem',
	barDraggable:true,// allows to drag the bar
	barClass:'cuteScroll-bar', // default bar class

	railColor:'black',//rail default color
	railWidth:false,// if not defined, uses scrollerWidth
	railIndent:false,// if not defined, uses scrollerIndent
	railOpacity:0.1,
	railBorderRadius:'1rem',
	railVisible:false,// Makes rail visible
	railClass:'cuteScroll-rail',// default rail class

	scrollerIndent:'0.1rem',// scroller edge indent
	scrollerPosition:'right',// side position -> scrollerPosition: right|left
	scrollerWidth:'0.4rem',
	scrollerAlwaysVisible:false,// if true, scroller becomes permanently visible
	scrollerHideDelay:1000,
	scrollerFadeOutSpeed:'slow',
	scrollerFadeInSpeed:'fast',

	pageScroll:true,// check if mousewheel should scroll the window if we reach top/bottom
	wheelStep:120,// scroll step for wheel

	touchSwipeStrengthFactor:1.25,// touch swipe strength coefficient
	touchSwipeFadingFactor:0.075,// fading coefficient
	touchSwipeVelocityThreshold:0.5,// touch movement velocity which is considered a swipe
	touchSwipeDistanceThreshold:10,// touch movement distance to be considered a swipe
	touchSwipeTimeAdjustmentThreshold:500,// recaltulates swipe parameters
	touchSwipeIterationMinDistance:0.2,// min swipe iteration distance
	touchSwipeIterationTimeout:5,// iteration timeout
	touchMoveFactor:1.1,// makes leaps faster (>1) or more slowly (<1)

	height:'20rem',// scrollable element height
	width:'100%',// scrollable element width
	addClass:false,// adds classes to scrollable element on initialization -> addClass: <string>
	removeClass:false,// removes classes of scrollable element on remove -> removeClass: <string>
	addCss:false,// adds css on initialization
	removeCss:false,// removes css on remove command, may use the same data as addCss

	wrapperClass:'cuteScroll-wrapper',// default wrapper class
	//callbacks and related settings:
	onContentChange:false,// expects function which is called on content change -> onContentChange: <function>
	onContentChangeShow:true,// show scroller on content change if it is reasonable
	//commands:
	remove:false,// removes scroller, restores previous scrollable element style
	jumpToTop:false,// jumps to the top of the scrollable element
	jumpToBottom:false,// jumps to the bottom of the scrollable element
	alert:false,// allerts a message -> alert: <string>
};
```
### Demo

[Presentation of the index.html file](https://merrypanda.github.io/jQuery.cuteScroll)