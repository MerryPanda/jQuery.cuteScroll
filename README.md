# jQuery.cuteScroll
Responsive jQuery y-axis scroll plugin that supports touches, swipes, mouse events.
Does not support overlapping elemens scrolling for now.

## Installation
```html
<script src="jquery.cutescroll.min.js"></script>
```

## Configuration
```javascript
jQuery.cuteScroll.defaults={
	bar:{
		// any css settings
		opacity:0.5,
		minHeight:'4rem',
		zIndex:110,
		////// settings
		class:'cuteScroll-bar',//default class name
	},
	rail:{
		// any css settings
		opacity:0.1,
		height:'100%',
		zIndex:100,
		////// settings
		visible:true,// Makes rail visible
		class:'cuteScroll-rail',//default class name
	},
	scroller:{// bar and rail will get these values if have no own
		// any css settings
		background:'black',
		width:'0.5rem',
		right:0,
		////// settings
		alwaysVisible:false,// if true, scroller becomes permanently visible
		hideDelay:1000,
		fadeOutSpeed:'slow',
		fadeInSpeed:'fast',
	},
	canvas:{//scrollable element
		// any css settings
		class:'cuteScroll-canvas',//default class name
	},
	wrapper:{
		// any css settings
		class:'cuteScroll-wrapper',//default class name
	},
	area:{// wrapper and canvas (scrollable element) will get these values if have no own
		// any css settings
		height:'20rem',// scrollable element height
		width:'100%',// scrollable element width
	},
	mouse:{
		pageScroll:true,// check if mousewheel should scroll the window if we reach top/bottom
		wheelStep:120,// scroll step for a wheel
	},
	touch:{
		moveFactor:1.1,// makes leaps faster (>1) or more slowly (<1)
		swipeStrengthFactor:1.25,// touch swipe strength coefficient
		swipeFadingFactor:0.075,// fading coefficient
		swipeVelocityThreshold:0.5,// touch movement velocity which is considered a swipe
		swipeDistanceThreshold:10,// touch movement distance to be considered a swipe
		swipeTimeAdjustmentThreshold:500,// recaltulates swipe parameters
		swipeIterationMinDistance:0.2,// min swipe iteration distance
		swipeIterationTimeout:5,// iteration timeout
	},
	//element:{}, - you can change properties of every element you want
	on:{//related to events
		contentChange:false,// expects a function which is called on content change
		contentChangeShowScroller:true,// show scroller on content change if it is reasonable
	},
	//priority:1,//defines overlapping priority, not supported for now
};
```

## How To Use
All confuguration commands should be included in a command object to be recognized, as simple as this:
```javascript
jQuery.cuteScroll({
	create:{// is the command object
		area:{
			// any css settings
			width:'100vw',
			height:'100vh'
		},
		element:{
			body:{
				// any css settings
				overflow:'hidden',
			}
		}
	}
});
```

### Commands
- create:`object` - creates a scroller
- recreate:`object` - recreates a scroller
- update:`object` - updates settings
- jumpToTop:`boolean` - jumps to the top of a scrollable div if TRUE
- jumpToBottom:`boolean` - jumps to the bottom of a scrollable div if TRUE
- log:`string` - logs some message via console
- alert:`string` - alerts some message
- remove:`boolean` - removes a scroller if TRUE

### AddClass, removeClass
You can add or remove any class of a scroller element. All changes will be reversed on the remove command
```javascript
jQuery.cuteScroll({
	create:{// is the command object
		bar:{
			// any css settings
			addClass:'newMyBarClass'
			removeClass:'formerMyBarClass'
		},
		area:{
			// any css settings
			width:'100vw',
			height:'100vh'
		},
	}
});
```

### Editing Other Elements
You can also edit other elements properties by tag, class or id name or just change their css values. All changes will be reversed on the remove command
```javascript
jQuery.cuteScroll({
	update:{// is the command object
		'someTag':{
			// any css settings
			background:'pink',
		},
		'.someClass':{
			// any css settings
			addClass:'newClass'
			removeClass:'formerClass'
		},
		'#someId':{
			// any css settings
			background:'blue',
		},
	}
});
```

### Listeners
#### on.contentChange
Expects a function which will be called on a scrollable element content change
```javascript
jQuery.cuteScroll({
	create:{// is the command object
		on:{
			contentChange:function(e){// e - is the scrollable element jQuery object
				e.cuteScroll({
					update:{
						jumpToTop:true
					}
				})
			}
		}
	}
});
```

## Demo
[Presentation of the index.html file](https://merrypanda.github.io/jQuery.cuteScroll)