
/**
 * Boilerplate code required to hook into the ADTECH rich media library.
 *
 * For API documentation, please contact canvas-help@adtech.com
 */
(function(adConfig) {
  
  var requiresBreakout = false;
  if (!adConfig.overrides || adConfig.overrides.displayWindowTarget != self) {
    for (var id in adConfig.assetContainers) {
      if (adConfig.assetContainers.hasOwnProperty(id)) {
        var container = adConfig.assetContainers[id];
        if (container.type != 'inlineDiv' || container.isExpandable) {
          requiresBreakout = true;
          break;
        }
      }
    }
  }

  if (adConfig.overrides && adConfig.overrides.displayWindowTarget) {
    var displayWindowTarget = adConfig.overrides.displayWindowTarget;
    displayWindowTarget = (typeof adtechIframeHashArray != 'undefined' && self != top) ?
        displayWindowTarget.parent : displayWindowTarget;
  } else {
    var calculatedTarget = null;
    var currentWindow = parent;
    while (currentWindow != undefined) {
      try {
        var targetDoc = currentWindow.document;
        if (targetDoc) {
          calculatedTarget = currentWindow;
        }
      } catch(e) {}
      currentWindow = (currentWindow == top) ? null : currentWindow.parent;
    }
    var displayWindowTarget = calculatedTarget || top;
  }

  var targetIsFriendly = false;
  try {
    var targetDoc = displayWindowTarget.document;
    if (targetDoc) {
      targetIsFriendly = true;
    }
  } catch(e) {}

  var targetWindow = (requiresBreakout && (self != top && targetIsFriendly)) ?
          displayWindowTarget : self;

  targetWindow.com = targetWindow.com || {};
  targetWindow.com.adtech = targetWindow.com.adtech || {};

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$ = function() {
    // Custom code class constructor.
  };

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$.prototype = {

    preInit: function() {   
      window.com = com || {};
      com.adtech = targetWindow.com.adtech || {};
    },

    init: function(advert) {
      if (!advert.richView) {
        // The backup client can not render the rich version of the advert.
        return;
      }
      
      console.log('////////////// VERSION 1.8 ////////////////////');
      
      
      // A few useful things to help you get started. Please delete as necessary!
      this.advert = advert;
      this.utils = com.adtech.Utils_$VERSION$;
      this.globalEventBus = targetWindow.adtechAdManager_$VERSION$.globalEventBus;
      this.richMediaEvent = com.adtech.RichMediaEvent_$VERSION$;

      
      this.setPageProperties();
      this.backgroundSet = false;
      this.pageScrollClosure = this.utils.createClosure(this, this.pageScrollHandler);
      this.globalEventBus.addEventListener(this.richMediaEvent.PAGE_SCROLL, this.pageScrollClosure);
      
      
      if (this.globalEventBus.DOMLoaded) {
        this.domLoadHandler();
      } else {
        this.globalEventBus.addEventListener('DOMLoad',
            this.utils.createClosure(this, this.domLoadHandler));
      }
      if (this.globalEventBus.pageLoaded) {
        this.pageLoadHandler();
      } else {
        this.globalEventBus.addEventListener(this.richMediaEvent.PAGE_LOAD,
            this.utils.createClosure(this, this.pageLoadHandler));
      }     
    },
    
    setPageProperties: function() {
      this.targetDoc = targetWindow.document;
      this.pageContentWidth = parseInt(this.advert.getContent('Page Content Width'));
      //this.pageContentWidth = 984;
      this.pageTeaserWidth = 120;
    },
    
    pageScrollHandler: function() {

      var pageOffset = this.utils.getPageOffsets().y;
      var viewportHeight = this.utils.getViewportDims().h;
      var scrollPercentage = (100 / viewportHeight) * pageOffset;
      var maincontent = targetDoc.getElementById('maincontent');
      
      try {
        if (scrollPercentage > 20) {
          if (!this.backgroundSet) {
            // ADTECH.event('enableBackground');
            var scrollEvent = new this.richMediaEvent('enableBackground');
            this.advert.eventBus.dispatchEvent(scrollEvent);
      //    mainBanner.style.backgroundColor = '#f4f4f2';
            this.backgroundSet = true;
          }
        } else {
          if (this.backgroundSet) {
            // ADTECH.event('disableBackground');
            var scrollEvent = new this.richMediaEvent('disableBackground');
            this.advert.eventBus.dispatchEvent(scrollEvent);
      //      mainBanner.style.backgroundColor = 'transparent';
            this.backgroundSet = false;
          }
        } 
      } catch (e) {
        console.log('[Scroll error] : ' + e);
      }
    },

    clearHtmlBackground: function() {
      var header = targetDoc.getElementById('aol-header');
      var maincontent = targetDoc.getElementById('maincontent');
      var precontent = targetDoc.getElementById('precontent');
      var stripenav = targetDoc.getElementsByClassName('stripenav');
      var mestripescrollfix = targetDoc.getElementsByClassName('mestripescrollfix')[0];
      try {
        maincontent.style.backgroundColor = 'transparent';
        mestripescrollfix.style.backgroundColor = 'transparent'; // '#f4f4f2';
      } catch (e) {
        console.log('[skin](clearHtmlBackground) main or mestrip failed', e);
      }
      
      try {
        stripenav[0].style.backgroundColor = '#f4f4f2';
        stripenav[1].style.backgroundColor = '#f4f4f2'; 
      } catch (e) {
        console.log('[skin](clerHtmlBackground), strip nav not found');
      }
      
      // Article page
      try {
        console.log('[skin][{Y}](clearHtmlBackground) precontent children ' + precontent.children.length);
        if (precontent.children.length > 0) {
          precontent.style.backgroundColor = 'transparent';
          var floatContainer= this.advert.getAssetContainer("float");
          floatContainer.div.style.marginTop = '73px';
        }
      } catch (e) {
        console.log('[skin](clearHtmlBackground) precontent failed', e);
      }
      //HOMEPAGE
      try {
                if((targetWindow.location.href ==='https://www.msn.com/it-it') || (targetWindow.location.href.substring(0, 26) === 'https://www.msn.com/it-it?')) {
                    floatContainer.div.style.marginTop = '20px';
                }
          } catch (e) {
                console.log('main HP IT', e);
          }
 
    },
    
    getGutterWidth: function() {      
      var viewportDims = this.utils.getViewportDims();      
      var totalGutterAvailableWidth = (this.pageContentWidth >= viewportDims.w) ?
          0 : Math.floor((viewportDims.w - this.pageContentWidth));
      return totalGutterAvailableWidth / 2;
    },

    createAnchor: function(id, x, y, width, height) {      
      var anchor = this.targetDoc.createElement('a');
      anchor.id = id;
      anchor.target = '_self';
      anchor.style.position = 'fixed';
      anchor.style.zIndex = 1;
      anchor.style.left = x + 'px';
      anchor.style.top = y + 'px';
      anchor.style.width = width + 'px';
      anchor.style.height = height + 'px';
      anchor.style.background = 'none';
      anchor.style.outline = 'none';
      anchor.style.outlineStyle = 'none';
      anchor.onclick = this.utils.createClosure(this, this.anchorClickHandler);
      anchor.href = '#';
      anchor.style.cursor = 'pointer';
      return this.targetDoc.body.appendChild(anchor);
    },
        
    createAnchors: function() {
      var gutterWidth = this.getGutterWidth();
      var viewportDims = this.utils.getViewportDims();
       this.leftAnchor =
          this.createAnchor('pct-left-anchor-' + this.advert.id, 0,
          0, gutterWidth, viewportDims.h); // 756 || viewportDims.h
      var anchorX = viewportDims.w - gutterWidth;
      this.rightAnchor =
          this.createAnchor('pct-right-anchor-' + this.advert.id, anchorX,
          0, gutterWidth, viewportDims.h); // 756 || viewportDims.h
      this.globalEventBus.addEventListener(this.richMediaEvent.PAGE_RESIZE,
          this.utils.createClosure(this, this.pageResizeHandler));
    },
        
    /**************************
     * Event handlers
     *************************/
            
    anchorClickHandler: function() {
      this.advert.click();
      return false;
    },
        
    pageResizeHandler: function() {
      var gutterWidth = this.getGutterWidth();
      var viewportDims = this.utils.getViewportDims();
      this.leftAnchor.style.width = this.rightAnchor.style.width = gutterWidth + 'px';
      this.rightAnchor.style.left = (viewportDims.w - gutterWidth) + 'px';

      this.updateBlockA();
    },
    
    domLoadHandler: function() {
      this.createAnchors();
    },

    pageLoadHandler: function() {
      try {
        this.clearHtmlBackground(); 
      } catch (e) {
        console.log('[skin](pageLoadHandler) clear HTML background failed - maybe not msn website', e);
      }
      this.updateBlockA();
      try {
        //targetWindow.document.getElementById('maincontent').style.backgroundColor = 'transparent;';
        targetWindow.document.querySelector(".mestripeouter.stripeouter").style.border = "none";//JUTI
      } catch (e) {
        console.log('[skin](pageLoadHandler) mestripeouter not found', e);
      }

      try {
        targetWindow.document.body.style.backgroundColor = '#f4f4f2';
      } catch (e) {
        console.log('[skin](pageLoadHandler) ____ body style BG error color', e);
      } 

      try {
        //targetWindow.document.querySelector(".skyline.headline-template").style.overflow= "visible";
        targetWindow.document.querySelector(".skyline.headline-template").style.background= "transparent";
        targetWindow.document.querySelector(".skyline").style.backgroundColor= "none !important";
        //targetWindow.document.querySelector(".pagingsection.loaded").style.display = "none !important";
      } catch(e){
        console.log('[skin](pageLoadHandler) query selector on skyline error', e); 
      }
      
      
      
      
      
    },

    updateBlockA: function() {
       //call pageResizeHandler if you want/need the viewport dims
      //note -- complain to sam about h being a dumb variable name for height
      var vpd = this.utils.getViewportDims();
      var c = vpd.h;
      var b = this.targetDoc.documentElement.scrollHeight;
      var a = b-c;
      var d = this.advert.getAssetContainer('main').div;
      var obj = {height:a};
     //LUKE - dispatch that event here
      
      
       var event = new this.richMediaEvent('customEvent');
    event.meta = obj; 
    this.advert.eventBus.dispatchEvent(event);

      
      

    }
  };

  targetWindow.adtechCallbackInstances = targetWindow.adtechCallbackInstances || [];
  var instanceIndex = targetWindow.adtechCallbackInstances.length;
  targetWindow.adtechCallbackInstances[instanceIndex] =
      new targetWindow.com.adtech.AdtechCustomAd$AD_ID$();

  targetWindow.adtechAdCallbacks = targetWindow.adtechAdCallbacks || {};
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] =
      targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] || [];
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid].push(
      targetWindow.adtechCallbackInstances[instanceIndex]);
})(adtechAdConfig);

