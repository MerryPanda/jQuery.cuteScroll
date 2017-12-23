/*
2017

Cute Scroll jQuery plugin by Merry Panda (https://github.com/MerryPanda)

Inspired by Slim Scroll https://github.com/rochal/jQuery-slimScroll

Version 1.0
*/
(function(jq){
	var util={//utils
		generator:new function(){
			this.id=function(){
				return Date.now().toString(36)+'-'+Math.random().toString(36).substr(2, 8);
			}
		},
		el:new function(){
			this.css=new function(){
				this.clean=function(o){
					for(var e in o) o[e]='';
					
					return o;
				}
			}
			//////
			this.defaultsAdd=function(jqe,cfg,css){
				return jqe.addClass(cfg.class).css(css);
			}
			//////
			this.additions=new function(){
				this.add=function(jqe,cfg){
					jqe.addClass(cfg.addClass || null).removeClass(cfg.removeClass || null).css(cfg || null);
				}
				this.remove=function(jqe,cfg){
					jqe.addClass(cfg.removeClass || null).removeClass(cfg.addClass || null).removeClass(cfg.class || null).css(util.el.css.clean(cfg || null));
				}
			}
		}
	}
	
	var unit={//units
		item:function(noticer,e){
			var cfg={};
			var el=new unit.el(cfg,e,noticer);
			var scroller=new unit.scroller(cfg,el,noticer);
			var event=new unit.event(cfg,el,scroller);
			var command=new unit.command(cfg,el,noticer,event,scroller);
			//////
			this.process=function(req){
				for(var i in command) if(req && req[i] && command[i]) command[i](req[i]);
			}
		},
		observer:function(){
			var item={};
			//////
			function jseGet(i){
				return item[i] ? item[i].jse : null;
			}
			//////
			this.itemRemove=function(id){
				if(item[id]){
					item[id].jqe.removeData('id');

					delete item[id];
				}
			}
			this.itemCreateAndProcess=function(e,req){
				var id=util.generator.id();
				
				item[id]={
					obj:new unit.item(new unit.noticer(this,id),e),
					jqe:jq(e),
					jse:e,
				};
				
				item[id].jqe.data('id',id);
				item[id].obj.process(req);
			}
			this.itemRecreate=function(id,req){
				var e=jseGet(id);
				//console.log(e,id,req)
				this.itemRemove(id);
				this.itemCreateAndProcess(e,req);
			}
			this.itemExists=function(i){
				return item[i] ? true : false;
			}
			this.itemInvokeAndProcess=function(id,req){
				if(item[id]) item[id].obj.process(req);
				else throw new Error(`item does not exist : ${id}`);
			}
			//////
		},
		noticer:function(observer,id){
			var created=false;
			var enabled=true;
			//////
			this.isCreated=function(){
				return created;
			}
			this.setToCreated=function(){
				created=true;
			}
			this.setToNotCreated=function(){
				created=false;
			}
			//////
			this.isEnabled=function(){
				return enabled;
			};
			this.setToEnabled=function(){
				enabled=true;
			};
			this.setToDisabled=function(){
				enabled=false;
			};
			//////
			this.remove=function(){
				observer.itemRemove(id);
			}
			this.recreate=function(command){
				observer.itemRecreate(id,command);
			}
		},
		el:function(cfg,e,noticer){
			var that=this;
			var els=['wrapper','canvas','rail','bar'];
		
			this.wnd=new unit.wnd;
			this.doc=new unit.doc;
			this.wrapper=new unit.wrapper(cfg,e);
			this.canvas=new unit.canvas(cfg,e);
			this.rail=new unit.rail(cfg,e);
			this.bar=new unit.bar(cfg,e);
			//////
			function invokable(){
				that.wnd.invoke();
				that.doc.invoke();
			}
			function additions(method,el,cfg){
				for(var i in el){
					if(cfg){
						if(that[el[i]]) util.el.additions[method](that[el[i]].jq,cfg[el[i]]);
					}else util.el.additions[method](jq(i),el[i]);
				}
			}
			function additionsAdd(){
				additions('add',els,cfg);
				additions('add',cfg.element);
			}
			function additionsRemove(){
				additions('remove',els,cfg);
				additions('remove',cfg.element);
			}
			function create(){
				invokable();
				
				that.wrapper.create();
				that.canvas.create();
				that.rail.create();
				that.bar.create();
			}
			//////
			this.activate=function(){
				if(!noticer.isCreated()) create();
				
				additionsAdd();
			}
			this.remove=function(){
				additionsRemove();
				
				this.bar.remove();
				this.rail.remove();
				this.canvas.unwrap();
			}
		},
		wnd:function(){//window object
			this.invoke=function(){
				this.jq=jq(window);
			};
		},
		doc:function(){//document object
			this.invoke=function(){
				this.jq=jq(document);
			};
		},
		event:function(cfg,el,scroller){
			var on=new unit.on(cfg,el,scroller);
			//////
			this.activate=function(){
				on.hover();
				on.scrollerBarDrag();
				on.wheelScroll();
				on.contentChange();
				on.resize();
				on.touch();
			}
			this.remove=function(){
				el.wnd.jq.off('resize.cs');
				el.bar.jq.off('mouseenter.cs mouseleave.cs mousedown.cs');
				el.rail.jq.off('mouseenter.cs mouseleave.cs');
				el.canvas.jq.off('mouseenter.cs mouseleave.cs wheel.cs mousewheel.cs touchstart.cs touchmove.cs touchend.cs');
				
				on.observer.disconnect();
			}
		},
		on:function(cfg,el,scroller){
			this.observer;
			//////
			this.hover=function(){
				el.rail.jq.on('mouseenter.cs',function(){scroller.visibility.shouldBeShown('rail')});
				el.rail.jq.on('mouseleave.cs',function(){scroller.visibility.canBeHidden('rail')});

				el.bar.jq.on('mouseenter.cs',function(){scroller.visibility.shouldBeShown('bar')});
				el.bar.jq.on('mouseleave.cs',function(){scroller.visibility.canBeHidden('bar')});
					
				el.canvas.jq.on('mouseenter.cs',function(){scroller.visibility.shouldBeShown('canvas')});
				el.canvas.jq.on('mouseleave.cs',function(){scroller.visibility.canBeHidden('canvas')});
			}
			this.scrollerBarDrag=function(){
				el.bar.jq.on('mousedown.cs',function(start){
					el.doc.jq.on('mousemove.cs',function(end){
						scroller.scrollByScrollerBar(end.pageY-start.pageY);

						start.pageY=end.pageY;
					});

					el.doc.jq.on('mouseup.cs',function(e){
						el.doc.jq.off('mousemove.cs');
						el.doc.jq.off('mouseup.cs');
					});

					start.preventDefault();
				})
			}
			this.wheelScroll=function(){
				el.canvas.jq.on('wheel.cs mousewheel.cs',function(e){
					var direction=Math.sign(e.originalEvent.deltaY);

					if(direction!==0) scroller.scrollByWheel(direction);

					if(!scroller.calc.shouldItContinueToScrollPage()) e.preventDefault();
				});
			}
			this.contentChange=function(){
				this.observer = new MutationObserver(function(o){
					if(cfg.on.contentChange) cfg.on.contentChange(el.canvas.jq);

					scroller.onContentChange();
				});
				this.observer.observe(el.canvas.js,{childList: true, subtree: true});
			}
			this.resize=function(){
				el.wnd.jq.on('resize.cs',function(){
					scroller.onContentChange();
				});
			}
			this.touch=function(){
				var touch;

				el.canvas.jq.on('touchstart.cs',function(e){
					scroller.visibility.shouldBeShown('touch')

					touch=new unit.touch(cfg);

					touch.start(e.originalEvent.touches[0].pageY)
				});

				el.canvas.jq.on('touchmove.cs',function(e){
					touch.move(e.originalEvent.touches[0].pageY);

					scroller.scrollByTouchMove(touch.moveDeltaGetAndShift());

					e.preventDefault();
				});

				el.canvas.jq.on('touchend.cs',function(e){
					scroller.visibility.canBeHidden('touch');

					scroller.scrollByTouchSwipe(touch.velocityGet(),touch.getDelta());
				});
			}
		},
		wrapper:function(cfg,e){
			var css={position:'relative', overflow:'hidden'};
			//////
			this.create=function(){
				this.jq=util.el.defaultsAdd(jq('<div>'),cfg.wrapper,css);

				jq(e).wrap(this.jq);
				
				this.invoke();
			}
			this.invoke=function(){
				this.jq=jq(e).parent('.'+cfg.wrapper.class);
			}
		},
		canvas:function(cfg,e){//scrollable element object
			var that=this;
			var css={overflow:'hidden'};
			this.js=e;
			//////
			function cssClean(){
				that.jq.css(util.el.css.clean(css));
			}
			//////
			this.create=function(){
				this.jq=util.el.defaultsAdd(jq(e),cfg.canvas,css);
			};
			this.invoke=function(){
				this.jq=jq(e);
			};
			//////
			this.unwrap=function(){
				cssClean();
				this.jq.unwrap();
			}
		},
		rail:function(cfg,e){
			var css={position:'absolute', zIndex:100, top:0};
			//////
			this.create=function(){
				this.jq=util.el.defaultsAdd(jq('<div>'),cfg.rail,css);
				
				jq(e).parent().append(this.jq);
				
				//this.invoke();
			}
			this.invoke=function(){
				this.jq=jq(e).siblings('.'+cfg.rail.class);
			}
			this.remove=function(){
				this.jq.remove();
			}
		},
		bar:function(cfg,e){
			var css={position:'absolute', zIndex:110, top:0};
			//////
			this.create=function(){
				this.jq=util.el.defaultsAdd(jq('<div>'),cfg.bar,css);
				
				jq(e).parent().append(this.jq);
			}
			this.invoke=function(){
				this.jq=jq(e).siblings('.'+cfg.bar.class);
			}
			//////
			this.remove=function(){
				this.jq.remove();
			}
		},
		scroller:function(cfg,el,noticer){
			var that=this;
			var display=new unit.scrollerDisplay(cfg,el);
			this.calc=new unit.scrollerCalc(cfg,el);
			var operation=new unit.scrollerOperation(cfg,el,this.calc);
			this.visibility=new unit.scrollerVisibility(cfg,noticer,display);
			//////
			function disable(){
				noticer.setToDisabled();

				display.hide();
			};
			function enable(){
				noticer.setToEnabled();

				that.visibility.canBeHidden();

				operation.barHeightApplyProportionalToContent();

				if(cfg.on.contentChangeShowScroller) that.visibility.shouldBeShown();
			};
			function scroll(i){
				//console.log('---scroll',el.canvas.jq,i)
				if(noticer.isEnabled()){
					that.visibility.shouldBeShown();
					
					operation.move(i);
				}
			};
			//////
			this.scrollByScrollerBar=function(amount){
				scroll(amount);
			}
			this.scrollByWheel=function(direction){
				scroll(direction*this.calc.wheelIteration());
			}
			this.scrollByTouchMove=function(distance){
				scroll(this.calc.touchIteration(distance))
			}
			this.scrollByTouchSwipe=function(velocity,distance){
				if(Math.abs(velocity)>cfg.touch.swipeVelocityThreshold && Math.abs(distance)>cfg.touch.swipeDistanceThreshold){
					var iteration=Math.abs(this.calc.touchIteration(distance)*velocity*cfg.touch.swipeStrengthFactor);
					var direction=-Math.sign(velocity);

					var wait=function(){
						if(iteration>cfg.touch.swipeIterationMinDistance){
							var push=iteration*direction;
							
							scroll(push);

							iteration-=Math.abs(push)*cfg.touch.swipeFadingFactor;

							setTimeout(wait,cfg.touch.swipeIterationTimeout);
						}
					}
					
					wait();
				}
			}
			//////
			this.jumpToTop=function(){
				operation.jumpToTop();
			}
			this.jumpToBottom=function(){
				operation.jumpToBottom();
			}
			//////
			this.onContentChange=function(){
				if(this.calc.shouldItBeEnabled()) enable();
				else disable();
			}
			this.activate=function(){
				this.onContentChange();
			}
		},
		scrollerDisplay:function(cfg,el){
			this.hide=function(){
				el.rail.jq.hide();
				el.bar.jq.hide();
			}
			this.fadeOut=function(){
				el.rail.jq.fadeOut(cfg.scroller.fadeOutSpeed);
				el.bar.jq.fadeOut(cfg.scroller.fadeOutSpeed);
			}
			this.fadeIn=function(){
				if(cfg.rail.visible) el.rail.jq.stop(true).fadeIn(cfg.scroller.fadeInSpeed);

				el.bar.jq.stop(true).fadeIn(cfg.scroller.fadeInSpeed);
			}
		},
		scrollerVisibility:function(cfg,noticer,display){
			var visible={};
			var wait;
			var that=this;
			//////
			function hide(){
				//console.log('---hide',that.shouldBeKeptVisible());
				if(!cfg.scroller.alwaysVisible){
					wait=setTimeout(function(){
						//console.log('---hide',that.shouldBeKeptVisible());
						if(!that.shouldBeKeptVisible()) display.fadeOut();
					},cfg.scroller.hideDelay);
				}
			}
			function show(){
				//console.log('---show',that.shouldBeKeptVisible());
				if(noticer.isEnabled()){
					clearTimeout(wait);

					display.fadeIn();

					hide();
				}
			}
			//////
			this.shouldBeKeptVisible=function(){
				for(var i in visible) return true;

				return false;
			};
			this.shouldBeShown=function(i){
				if(i) visible[i]=true;

				show();
			};
			this.canBeHidden=function(i){
				if(i) delete visible[i];
				else visible={};
			};
		},
		scrollerCalc:function(cfg,el){
			var percentage;
			//////
			this.wheelIteration=function(){
				return cfg.mouse.wheelStep/this.canvasMaxOffset()*this.railHeight();
			}
			this.touchIteration=function(delta){
				return cfg.touch.moveFactor*delta/this.canvasMaxOffset()*this.railHeight();
			}
			//////
			this.shouldItBeScrolled=function(){
				return this.canvasHeight()>this.railHeight() ? true : false;
			};
			this.shouldItContinueToScrollPage=function(){
				return (this.isAtEdge() && cfg.mouse.pageScroll) ? true : false;
			}
			this.isAtEdge=function(){
				return (percentage===0 || percentage===1) ? true : false ;
			}
			this.shouldItBeEnabled=function(){
				return (this.shouldItBeScrolled() || cfg.scroller.alwaysVisible) ? true : false;
			}
			//////
			this.canvasHeight=function(){
				return el.canvas.js.scrollHeight;
			}
			this.canvasMaxOffset=function(){
				return Math.abs(this.canvasHeight()-this.railHeight());
			}
			this.canvasAdjustedPosition=function(){
				return percentage*this.canvasMaxOffset();
			}
			this.canvasVisibleProportion=function(){
				return Math.abs(this.railHeight()/this.canvasHeight());
			}
			//////
			this.railHeight=function(){
				return el.rail.jq.outerHeight();
			};
			//////
			this.barHeight=function(){
				return el.bar.jq.outerHeight();
			};
			this.barPosition=function(){
				return el.bar.jq.position().top;
			}
			this.barHeightProportionalToContent=function(){
				return this.canvasVisibleProportion()*this.railHeight();
			}
			this.barMaxOffset=function(){
				return Math.abs(this.railHeight()-this.barHeight());
			};
			this.barJumpToTop=function(){
				percentage=0;
				
				return 0;
			};
			this.barJumpToBottom=function(i){
				percentage=1;
				
				return this.barMaxOffset();
			};
			this.barMovementDistance=function(y){
				var max=this.barMaxOffset();
				var pos=this.barPosition()+y;

				if(pos>max) var top=max;
				else if(pos<0) var top=0;
				else var top=pos;
				//console.log(this.el.scrollTop(),max,pos)
				percentage=top/max;
				
				return top;
			};
		},
		scrollerOperation:function(cfg,el,calc){
			function barMove(i){
				el.bar.jq.css('top',i);
			}
			function barHeightSet(i){
				el.bar.jq.css('height',i);
			}
			function canvasMove(i){
				el.canvas.jq.scrollTop(i);
			}
			function moveTo(i){
				barMove(i);
				canvasMove(calc.canvasAdjustedPosition());
			}
			//////
			this.move=function(y){
				//console.log('--move',el.canvas.jq,calc.barMovementDistance(y),calc.canvasAdjustedPosition())
				moveTo(calc.barMovementDistance(y));
			};
			this.barHeightApplyProportionalToContent=function(){
				if(!cfg.bar.height) barHeightSet(calc.barHeightProportionalToContent());
			}
			this.jumpToTop=function(){
				moveTo(calc.barJumpToTop());
			}
			this.jumpToBottom=function(){
				moveTo(calc.barJumpToBottom());
			}
		},
		touch:function(cfg){
			var time={early:null,current:null};
			var pos={
				y:{early:null,last:null,current:null},
				delta:null,
			}
			//////
			function update(){
				var delta=time.current-time.early;

				if(delta>cfg.touchSwipeTimeAdjustmentThreshold){
					time.early+=delta/2;
					pos.y.early+=(pos.y.current-pos.y.early)/2;
				}
			}
			//////
			this.velocityGet=function(){
				var y=pos.y.current-pos.y.early;
				var t=time.current-time.early;

				return y/t;
			}
			this.moveDeltaGetAndShift=function(){
				pos.delta=pos.y.last-pos.y.current;

				pos.y.last=pos.y.current;

				return pos.delta;
			}
			this.distanceGet=function(){
				return Math.abs(pos.y.current-pos.y.early);
			}
			this.getDelta=function(){
				return pos.delta;
			}
			this.move=function(y){
				pos.y.current=y;

				time.current=new Date().getTime();

				update();
			}
			this.start=function(y){
				pos.y.early=pos.y.last=y;

				time.early=new Date().getTime();
			}
		},
		command:function(cfg,el,noticer,event,scroller){
			var configurator=new unit.configurator(cfg);
			//////
			function clean(){
				if(noticer.isCreated()){
					event.remove();
					el.remove();
					
					noticer.setToNotCreated();
				}
			}
			//////
			this.create=function(command){
				if(!noticer.isCreated()){
					configurator.fresh(command);
					el.activate();
					event.activate();
					scroller.activate();
					
					noticer.setToCreated();
				}
			}
			this.recreate=function(command){
				clean();
				
				noticer.recreate({create:command});
			}
			this.update=function(command){
				if(noticer.isCreated()){
					configurator.proceed(command);
					el.activate();
					scroller.activate();
				}
			}
			this.jumpToTop=function(){
				if(noticer.isCreated()) scroller.jumpToTop();
			}
			this.jumpToBottom=function(){
				if(noticer.isCreated()) scroller.jumpToBottom();
			}
			this.log=function(command){
				console.log(command);
			}
			this.alert=function(command){
				alert(command);
			}
			this.remove=function(command){
				clean();

				noticer.remove();
			}
		},
		configurator:function(cfg){
			function command(o){
				if(o.rail){
					o.rail.display=o.rail.visible ? 'block' : 'none';
				}
				return o;
			}
			function adjust(o){
				o.bar=jq.extend({},o.scroller,o.bar);
				o.rail=jq.extend({},o.scroller,o.rail);
				o.canvas=jq.extend({},o.area,o.canvas);
				o.wrapper=jq.extend({},o.area,o.wrapper);
				
				return o;
			}
			//////
			this.proceed=function(o){
				jq.extend(true,cfg,adjust(o));
			}
			this.fresh=function(o){
				this.proceed(jq.extend(true,{},jq.fn.cuteScroll.defaults,command(o)));
			}
			//////
			this.cfgClean=function(){
				for(var i in cfg) delete cfg[i];
			}
		},
	}
	
	var master=new function(){
		var observer=new unit.observer;
		//////
		this.process=function(e,req){
			var id=jq(e).data('id');
			
			if(id && observer.itemExists(id)) observer.itemInvokeAndProcess(id,req);
			else observer.itemCreateAndProcess(e,req);
		}
	}
	
	jq.fn.cuteScroll=function(req){
		this.each(function(){// do it for every element that matches selector
			master.process(this,req);
		});
		return this;// return jQuery selector object
	};

	jq.fn.cuteScroll.defaults={
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
})(jQuery);