
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

(function(jQuery, $) {
  
      try {
        const funcESSectionqwEBV9D3Ode9tAW = function() {
          (function (jQuery) {
  jQuery.GT_NAME_PREFIX_PASCALCASE = function (element, options) {

    var defaults = {};
    this.settings = {};
    var $element = jQuery(element);
    var _this = this;


    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      this.event();
    };

    this.event = function () {
      /*
        CODE FOR ACTIONS
      */
    };

    this.init();

  };

  jQuery.fn.GT_NAME_PREFIX_PASCALCASE = function (options) {
    return this.each(function () {
      var plugin = new jQuery.GT_NAME_PREFIX_PASCALCASE(this, options);
      jQuery(this).data("GT_NAME_LOWERCASE", plugin);
    });
  };
})(jQuery);

var $section = $(".gt_section-qwEBV9D3Ode9tAW");
if ($section && $section.length) {
  $section.GT_NAME_PREFIX_PASCALCASE({
    /*
      OPTIONS
    */
  });
}

        }
        funcESSectionqwEBV9D3Ode9tAW()
      } catch(e) {
        console.error("Error ESSection Id: qwEBV9D3Ode9tAW" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
})(window.esQuery || jQuery, window.esQuery || jQuery);

    
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

    (function(jQuery, $) {
      
      try {
        const funcESWidgetwyVNmUpSikfP77r = function() {
          

        }
        funcESWidgetwyVNmUpSikfP77r()
      } catch(e) {
        console.error("Error ESWidget Id: wyVNmUpSikfP77r" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
    try {
      function triggerDToStore() {
        window.SOLID = window.SOLID || {};
        var discounts = window.SOLID.discounts || [];
        if (window.store && window.store.update) {
          window.store.update("discounts", discounts)
        }
      }
      triggerDToStore()
    } catch(e) {
      console.log("=============================== START ERROR =================================")
      console.log(e)
      console.log("===============================  END ERROR  =================================")
    }
  
    })(window.esQuery || jQuery, window.esQuery || jQuery);
  
    
  