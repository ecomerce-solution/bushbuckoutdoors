var ICO = ICO || {};
(function ($) { 
  var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
  var $window = $(window),
      body = $("body"),
      deviceAgent = navigator.userAgent.toLowerCase(),
      isMobileAlt = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/),
      imageZoomThreshold = 20;
  ICO.header = {
    init: function(){
      ICO.header.logoRetinaInit(); 
      if ($("#main-header").data('sticky') == true && $.fn.sticky) { 
        ICO.header.stickyInit();
      }
    },
    logoRetinaInit: function() {
      var $logoImg = $('.header-wrapper .header-container .logo img.x1');
      if (pixelRatio > 1) {
        if($('.template-index').length>0){
          $logoImg.attr('src', $logoImg.attr('src').replace(frontendData.logoHome, frontendData.logoHomeRetina));
        }else{
          $logoImg.attr('src', $logoImg.attr('src').replace(frontendData.logo, frontendData.logoRetina));
        }
      }
    },
    stickyInit: function(){
      $("#main-header").sticky({ topSpacing: 0 });
      $("#main-header-mobile").sticky({ topSpacing: 0 });
      $("#wrapper-top-menu").sticky({ topSpacing: 60 });
    }
  };
  ICO.page = {
    init: function() {
      if($('body').find('#resultLoading').attr('id') != 'resultLoading'){
        $('body').append('<div id="resultLoading" style="display:none"><div class="spinner"><div class="circle"></i></div><div class="bg"></div></div>');
      }
      $.browserSelector();
      if ($("html").hasClass("chrome")) {
        $.smoothScroll();
      }
      if ($("html").hasClass("safari")) {
        $.smoothScroll();
      }
      if (pixelRatio > 1) {
        ICO.page.imageRetinaInit();
        //ICO.page.disableLinkMobile();
      }    
      ICO.page.videoInit();
      if($('#popup_newsletter').length > 0){
        var newsletter = $('#popup_newsletter'); 
        ICO.page.newsletterPopupInit(newsletter);
      } 
    }, 
    imageRetinaInit: function(){
      $('img[data-srcX2]').each(function () {
        if ($(this).hasClass('lazy') || $(this).hasClass('lazyOwl')) {
          return;
        } else {
          $(this).attr('src', $(this).attr('data-srcX2'));
        }
      });
    },
    disableLinkMobile: function () {
      $('.products-grid').find('a.product-image').click(function(e){
        e.preventDefault();
        return false;
      });
    },    
    videoInit:function(){
      $(".container-main-video .upb_video-wrapper .upb_video-bg em").click(function () {
        if($(this).hasClass("fa-play")){
          $(".container-main-video .upb_video-wrapper .upb_video-bg video").get(0).play();
        }
        else
          $(".container-main-video .upb_video-wrapper .upb_video-bg video").get(0).pause();
        $(this).toggleClass("fa-pause").toggleClass("fa-play");
        return false;
      });
    },
    newsletterPopupInit: function(newsletter){
      $('#popup_newsletter .subcriper_label input').on('click', function(){
        if($(this).parent().find('input:checked').length){
          ICO.collection.createCookie('newsletterSubscribe', 'true', 1);
        } else {
          ICO.collection.readCookie('newsletterSubscribe'); 
        }
      });
      $('#popup_newsletter .input-box button.button').on('click', function(){
        var button = $(this);
        setTimeout(function(){
          if(!button.parent().find('input#popup-newsletter').hasClass('validation-failed')){ 
            ICO.collection.createCookie('newsletterSubscribe', 'true', 1);
          }
        }, 500);
      });  
      if (ICO.collection.readCookie('newsletterSubscribe') == null) {
        $.colorbox({
          inline:true,
          href: newsletter,
          opacity:	0.3,
          speed:		500,
          innerWidth: newsletterData.width+'px',
          innerHeight: newsletterData.height+'px',
          fixed: true,
          onOpen: function(){
            $('#cboxContent').addClass('newsletterbox');
            $('#cboxLoadingGraphic').addClass('box-loading'); 
            $(".newsletterbox").css({
              'background-image' : 'url('+newsletterData.bg_image+')',
              'background-position' : 'left top',
              'background-repeat' : 'no-repeat',
              'background-color' : newsletterData.bg_color,
              'background-size' : 'cover'
            });
          },
          onComplete: function(){
            setTimeout(function(){
              $('#cboxLoadingGraphic').removeClass('box-loading');
            },800);
          },
          onClosed: function(){
            $.colorbox.remove();
            $('#cboxContent').removeClass('newsletterbox');
            $('#cboxContent').attr('style','');
          }
        });
        ICO.page.newsletterResize();
        $window.smartresize( function() {
          if($('#colorbox').find('.block-subscribe').length>0){
          	ICO.page.newsletterResize();
          }
        });
      }  
    },
    newsletterResize: function() { 
      var width = "90%";
      var height = newsletterData.height+"px"; 
      if($(window).width() > 960) { width = newsletterData.width }
      if($(window).height() > 700) { height = newsletterData.height }
      if($(window).width() <= 600) {
        $('.newsletterbox .block-subscribe').css({
          'width':'90%',
          'top': '10%'
        })
      }else {
        $('.newsletterbox .block-subscribe').css({
          'width':'50%',
          'top': '15%'
        })
      }
      $.colorbox.settings.height = height;
      $.colorbox.settings.width = width; 
      $.colorbox.resize({
        'height': height,
        'width': width
      }); 
    },
    translateBlock: function(blockSelector) {
      if (multi_language && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    }
  };

  ICO.collection = {
    init: function() {
      if($('.owl-carousel').length > 0) {
        var carousel = $('.owl-carousel');
        carousel.each(function(){
          ICO.collection.carouselInit($(this));
        }); 
      }
      if ($(".products-grid.grid-product-masonry").length > 0) {
        var productsInstance = $(".grid-product-masonry");
        productsInstance.each(function() {
          ICO.collection.productGridSetup($(this));
        })
      }
      if($('.product-deal .product-date').length > 0){
        var productsDeal = $('.product-date');
        productsDeal.each(function(){
          ICO.collection.productDealInit($(this));
        });
      }
      ICO.collection.layoutSwitch(); 
      if (ICO.collection.readCookie('products-listmode') != null) {
        ICO.collection.layoutListInit();
      } 
      $(document).on("click", ".close-box", function(){
        $(this).parents('.box-popup').removeClass('show');
      })
      $(document).on("click", ".add-to-wishlist", function(e){ 
        e.preventDefault();
        ICO.collection.addToWishlist($(this));
      });
      $(document).on("click", ".remove-wishlist", function(e){ 
        e.preventDefault();
        ICO.collection.removeWishlist($(this));
      });  
      $(document).on("click", ".add-to-cart", function(e) {
      	e.preventDefault();
        ICO.collection.addToCart($(this));
      });
      $(document).on("click", ".btn-remove-cart", function(e) {
      	e.preventDefault();
        ICO.collection.removeCartInit($(this).data('id'));
      });
      ICO.collection.quickshopInit();
      ICO.collection.shareCounts();
      ICO.collection.sidebarMenuInit();
      ICO.collection.layerFilterInit();
      ICO.collection.colorSwatchGridInit();
    },  
    createCookie:function(name, value, days) {
      var expires;
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }
      document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    },
    readCookie:function(name) {
      var nameEQ = escape(name) + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    eraseCookie: function(name) {
      ICO.collection.createCookie(name, "", -1);
    },
    carouselInit: function(carousel) { 
      var data_carousel = carousel.parent().find('.data-carousel');
      if(data_carousel.data('auto')) {
        var autoplay = data_carousel.data('auto');
      }else{
        var autoplay = false;
      } 
      if(data_carousel.data('mobile')){ 
        carousel.owlCarousel({
          items: data_carousel.data('items'), 
          slideSpeed: 500,
          autoPlay: autoplay,
          pagination: data_carousel.data('paging'),
          addClassActive: true,
          navigation: data_carousel.data('nav'),
          itemsCustom: [[0,data_carousel.data('mobile')],[450,data_carousel.data('mobile')],[767,data_carousel.data('items')]],
          navigationText: [data_carousel.data('prev'),data_carousel.data('next')]
        }); 
      }else{
        carousel.owlCarousel({
          items: data_carousel.data('items'), 
          slideSpeed: 500,
          autoPlay: autoplay,
          pagination: data_carousel.data('paging'),
          addClassActive: true,
          navigation: data_carousel.data('nav'),
          navigationText: [data_carousel.data('prev'),data_carousel.data('next')] 
        });
      }
    },
    productGridSetup: function(productsInstance){
      productsInstance.imagesLoaded(function() {
        productsInstance.isotope({
          resizable: false,
          itemSelector: ".product",
          layoutMode: "fitRows"
        })
      });
      productsInstance.appear(function() {
        if (isMobileAlt) {
          setTimeout(function() {
            productsInstance.isotope("layout");
            ICO.collection.animateItems(productsInstance)
          }, 500)
        } else {
          ICO.collection.animateItems(productsInstance)
        }
      }); 
      $('#products').on('isotope:update', function(e) {
        productsInstance.isotope('layout');
      });
    },
    colorSwatchGridInit: function(){
      $('.configurable-swatch-list li a').on('click', function(e){
        e.preventDefault();  
        var productImage = $(this).parents('.product-action').find('.product-image'); 
        productImage.find('img.main').attr('src', $(this).data('image'));  
      });
    },
    animateItems: function(productsInstance) {
      productsInstance.find(".product").each(function(aj) {
        $(this).css('opacity', 1);
        $(this).addClass("item-animated"); 
      })
    },
    layoutSwitch: function() {
      var isSwitchingLayout = false;
      $(document).on('click', 'span.layout-opt', function(e) {
        var products = $('#products'),
            selectedLayout = $(this).data('layout');

        $('.toolbar .view-mode .layout-opt').removeClass('active');
        $(this).addClass('active');
        if(selectedLayout == 'list') {
          if (ICO.collection.readCookie('products-listmode') == null) {
            ICO.collection.createCookie('products-listmode', 1, 10);
          }
        }else{
          ICO.collection.eraseCookie('products-listmode');
        }
        if (isSwitchingLayout) {
          return;
        }
        isSwitchingLayout = true;
        products.animate({
          'opacity': 0
        }, 300);
        setTimeout(function() {
          products.find('.product').removeClass('product-layout-list product-layout-grid');
          products.find('.product').addClass('product-layout-' + selectedLayout);
          if ( $('.products-grid').length > 0 ) {
            $('.products-grid').children().css('min-height','0');
          } 
          products.isotope('layout');
          products.animate({
            'opacity': 1
          }, 200);
          isSwitchingLayout = false;
        }, 300);
        e.preventDefault();
      });
    },
    layoutListInit: function(){
      var products = $('#products');
      products.css('opacity',0);
      $('.toolbar .view-mode span[data-layout="grid"]').removeClass('active');
      $('.toolbar .view-mode span[data-layout="list"]').addClass('active');
      products.find('.product').removeClass('product-layout-list product-layout-grid');
      products.find('.product').addClass('product-layout-list'); 
      setTimeout(function() {
        products.animate({
          'opacity': 1
        }, 200);
      }, 300);
    },
    productDealInit: function(productDeal){ 
      var date = productDeal.data('date');
      if(date){
        var config = {date: date};
        $.extend(config, countdown); 
        $.extend(config, countdownConfig);
        if(countdownTemplate){
          config.template = countdownTemplate;
        }
        productDeal.countdown(config); 
      }
    },
    quickshopInit: function(){ 
      $(document).on("initproduct", "#product-form", function() { 
        var product_handle = $(this).data('id');
        var template = $('.product-view'); 
        Shopify.getProduct(product_handle, function(product) {
          template.find('.product-shop').attr('id', 'product-' + product.id);
          template.find('.product-form').attr('id', 'product-actions-' + product.id);
          template.find('.product-form .product-options select').attr('id', 'product-select-' + product.id);
          ICO.collection.createSwatch(product, template);
        });
      });
      $("#product-form").trigger("initproduct");
      $window.smartresize( function() {
        if($('#colorbox').find('.quick-view').length>0){
          ICO.collection.quickshopResize();
        }
      });
      $.colorbox.settings.maxWidth = "90%", $.colorbox.settings.width = "1000px";
      $(document).on("click", ".quickview", function() {
        var $prod = $(this).closest(".product");
        eval($prod.find("[data-id^=product-block-json-]").html());
        var template = $prod.find("[data-id^=product-block-template-]").html();
        return $.colorbox({ 
          opacity:	0.3,
          fixed: true,
          onOpen: function() {
            $("body").addClass("cbox-active")
          },
          onClosed: function() {
            $.colorbox.remove();
            $("body").removeClass("cbox-active");
            ICO.productMediaManager.destroyZoom();
          }, 
          html: [template].join(""),
          onComplete: function() {
            ICO.verticleScroll.init();
            ICO.productMediaManager.init();
            $("#product-form").trigger("initproduct");
            $.colorbox.resize(); 
            ICO.collection.quickshopResize();
            ICO.page.translateBlock('.quick-view');
            if(frontendData.enableCurrency) { 
              currenciesCallbackSpecial(".quick-view span.money");
            }
          }
        });
      }); 
    },
    createSwatch: function(product, layout){
      if (product.variants.length > 1) { //multiple variants
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>'; 
          layout.find('form.product-form > select').append(option);
        }
        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: ICO.collection.selectCallback
        });

        //start of quickview variant;
        var filePath = asset_url.substring(0, asset_url.lastIndexOf('?'));
        var assetUrl = asset_url.substring(0, asset_url.lastIndexOf('?'));
        var options = "";
        for (var i = 0; i < product.options.length; i++) {
          options += '<div class="swatch clearfix" data-option-index="' + i + '">';
          options += '<div class="header">' + product.options[i].name + '</div>';
          var is_color = false;
          if (/Color|Colour/i.test(product.options[i].name)) {
            is_color = true;
          }
          var optionValues = new Array();
          for (var j = 0; j < product.variants.length; j++) {
            var variant = product.variants[j];
            var value = variant.options[i];
            var valueHandle = ICO.collection.convertToSlug(value);
            var forText = 'swatch-' + i + '-' + valueHandle; 
            if (optionValues.indexOf(value) < 0) {
              //not yet inserted
              options += '<div data-value="' + value + '" class="swatch-element ' + (is_color ? "color" : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';
			  
              if (is_color) {
                options += '<div class="tooltip">' + value + '</div>';
              }
              options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';

              if (is_color) {
                options += '<label for="' + forText + '" style="background-color: ' + valueHandle + '; background-image: url(' + filePath + valueHandle + '.png)"><img class="crossed-out" src="' + assetUrl + 'soldout.png" /></label>';
              } else {
                options += '<label for="' + forText + '">' + value + '<img class="crossed-out" src="' + assetUrl + 'soldout.png" /></label>';
              }
              options += '</div>';
              if (variant.available) {
                $('.product-view .swatch[data-option-index="' + i + '"] .' + valueHandle).removeClass('soldout').addClass('available').find(':radio').removeAttr('disabled');
              }
              optionValues.push(value);
            }
          }
          options += '</div>';
        }  
        if(swatch_color_enable){ 
          layout.find('form.product-form .product-options > select').after(options);
          layout.find('.swatch :radio').change(function() {
            var optionIndex = $(this).closest('.swatch').attr('data-option-index');
            var optionValue = $(this).val();
            $(this)
            .closest('form')
            .find('.single-option-selector')
            .eq(optionIndex)
            .val(optionValue)
            .trigger('change');
          }); 
        }
        if (product.available) {
          Shopify.optionsMap = {};
          Shopify.linkOptionSelectors(product);
        }

        //end of quickview variant
      } else { //single variant
        layout.find('form.product-form .product-options > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        layout.find('form.product-form').append(variant_field);
      }
    },  
    convertToSlug: function(e) { 
      return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    },
    selectCallback: function(variant, selector) {  
      if (variant) {
        if (variant.available) {
          if (variant.compare_at_price > variant.price) { 
            $("#price").html('<del class="price_compare">' + Shopify.formatMoney(variant.compare_at_price, money_format) + "</del>" + '<div class="price">' + Shopify.formatMoney(variant.price, money_format) + "</div>")
          } else {
            $("#price").html('<div class="price">' + Shopify.formatMoney(variant.price, money_format) + "</div>");
          }
          frontendData.enableCurrency && currenciesCallbackSpecial("#price span.money"), 
          $("#add").removeClass("disabled").removeAttr("disabled").html($("#add").data("addtocart")), 
          variant.inventory_management && variant.inventory_quantity <= 0 ? ($("#selected-variant").html(selector.product.title + " - " + variant.title), $("#backorder").removeClass("hidden")) : $("#backorder").addClass("hidden")
        }else{
          $("#backorder").addClass("hidden"), $("#add").html($("#add").data("soldout")).addClass("disabled").attr("disabled", "disabled");
        }
        if(swatch_color_enable){ 
          var form = $('#' + selector.domIdPrefix).closest('form');
          for (var i=0,length=variant.options.length; i<length; i++) {
            var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
            if (radioButton.size()) {
              radioButton.get(0).checked = true;
            }
          } 
        }
      }
      if (variant && variant.featured_image && swatch_color_enable) {
        var n = Shopify.Image.removeProtocol(variant.featured_image.src);   
        $(".product-image-thumbs .thumb-link").filter('[data-zoom-image="' + n + '"]').trigger("click"); 
      }
      variant && variant.sku ? $("#sku").removeClass("hidden").find("span").html(variant.sku) : $("#sku").addClass("hidden").find("span").html(""); 
      ICO.collection.quickshopResize();
    },
    quickshopResize: function(){
      var width = 1000,
          percentageWidth = .9,
          resizeTimer;
      resizeTimer && clearTimeout(resizeTimer), resizeTimer = setTimeout(function() {
        $("#cboxOverlay").is(":visible") && ($.colorbox.resize({
          width: $(window).width() > width + 20 ? width : Math.round($(window).width() * percentageWidth)
        }), $(".cboxPhoto").css({
          width: $("#cboxLoadedContent").innerWidth(),
          height: "auto"
        }), $("#cboxLoadedContent").height($(".cboxPhoto").height()), $.colorbox.resize())
      }, 300);
    },
    addToWishlist: function(wishlist){          
      var form = wishlist.parents('form').serialize(),
          id = wishlist.data('id'),
          all = $("body").find(".wishlist-" + id + " .add-to-wishlist");  
      $.ajax({
        type: "POST",
        url: "/contact",
        async: !0,
        data: form,
        cache: !1,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function() {  
          var productInfo = wishlist.closest('.product'),
              box = $('#wishlist-box'); 
          box.find(".product-link").attr("href", productInfo.find(".product-name a").attr("href")), 
            box.find(".product-img").attr("src", productInfo.find(".product-image img").attr("src")).attr("alt", productInfo.find(".product-name a").html()), 
            box.find(".product-title .product-link").html(productInfo.find(".product-name a").html()), 
            box.find(".product-price").html(productInfo.find(".price").html());
          all.each(function() { 
            $(this).removeClass("add-to-wishlist").addClass("added").attr("title", $(this).attr("data-added")), 
              $(this).find("span").html($(this).attr("data-added")), 
              $(this).find("i").removeClass("fa-heart-o").addClass("fa-heart");
          }), setTimeout(function() {
            $("#resultLoading").hide();  
            box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3)
          }, 500)
        },
        error: function(t) {
          var box = $('#error-notice'),
              i = $.parseJSON(t.responseText);
          box.find(".heading").html(i.message), box.find(".message").html(i.description), setTimeout(function() {
            $("#resultLoading").hide(), 
              box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3);
          }, 500);
        }
      })
    },
    removeWishlist: function(wishlist){ 
      var form = wishlist.parents('form').serialize(),
          item = wishlist.parents('.item'); 
      $.ajax({
        type: "POST",
        url: "/contact",
        data: form,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function() {
          $("#resultLoading").hide(), item.fadeOut(500);
        },
        error: function() {
          var box = $('#error-notice'),
              i = $.parseJSON(t.responseText);
          box.find(".heading").html(i.message), box.find(".message").html(i.description), setTimeout(function() {
            $("#resultLoading").hide(), 
              box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3);
          }, 500);
        }
      })
    },
    addToCart: function(e){ 
      var form = e.parents('form');
      $.ajax({
        type: "POST",
        url: "/cart/add.js",
        async: !0,
        data: form.serialize(),
        dataType: "json",
        beforeSend: function() {
          $("#resultLoading").show();
        },
        error: function(t) {
          var box = $('#error-notice'),
              i = $.parseJSON(t.responseText);
          box.find(".heading").html(i.message);
          box.find(".message").html(i.description);
          setTimeout(function() {
            $("#resultLoading").hide(); 
            box.addClass('show');
            setTimeout(function() {
              box.removeClass('show');
            }, 5e3);
          }, 500);
        },
        success: function(t) {
          Shopify.getCart(function(e) {
            var i = parseInt(form.find('input[name="quantity"]').val()), 
                box = $('#cart-box');
              box.find(".product-link").attr("href", t.url), 
              box.find(".product-img").attr("src", Shopify.resizeImage(t.image, "medium")).attr("alt", t.title), 
              box.find(".product-title .product-link").html(t.title), 
              box.find(".product-price").html(Shopify.formatMoney(t.price, money_format)),    
              frontendData.enableCurrency && currenciesCallbackSpecial("#cart-box span.money");  
            setTimeout(function() {
              $("#resultLoading").hide(); 
              box.addClass('show'); 
              setTimeout(function() {
                box.removeClass('show');
              }, 5e3)
            }, 500), ICO.collection.updateCartInfo(e, ".cart-container .cart-wrapper .cart-inner-content")
          })
        },
        cache: !1
      });
    },
    updateCartInfo: function(cart, e){
      var c = $(e);
      if (c.length) {
      	c.empty();
        $.each(cart, function(key,value){
          if(key == 'items'){
          	var $html ='';
            if(value.length){ 
              	$html += '<div class="cart-content">';
            	$html += '<ul class="clearfix">';
              	$.each(value, function(i, item) {
                  $html += '<li class="item-cart">';
                  $html += '<a class="product-image" href="'+ item.url +'"><img alt="'+ item.title +'" src="'+ Shopify.resizeImage(item.image, 'small') +'" /></a>';
                  $html += '<div class="product-details row-fluid show-grid">';
                  $html += '<p class="product-name"><a href="'+ item.url +'"><span>'+ item.title +'</span></a></p>';
                  $html += '<div class="items"><span class="price">'+item.quantity+' × <span class="amount">'+ Shopify.formatMoney(item.price, money_format) +'</span></span></div>';
                  $html += '<div class="access"><a href="javascript: void(0);" class="btn-remove btn-remove-cart" data-id="'+item.variant_id+'" title="'+cartData.removeItemLabel+'"><i class="fa fa-trash"></i></a></div>';
                  $html += '</div>';
                  $html += '</li>';
                });
              	$html += '</ul>';
              	$html += '<p class="subtotal"><span class="label">'+cartData.totalLabel+'</span><span class="price">'+Shopify.formatMoney(cart.total_price, money_format)+'</span></p>';
              	$html += '</div>';
              	$html += '<div class="cart-checkout"><a href="/cart" class="btn-button view-cart"><span>'+cartData.buttonViewCart+'</span></a><a href="/checkout" class="btn-button checkout-cart"><span>'+cartData.buttonCheckout+'</span></a></div>';
            }else{ 
              	$html += '<div class="cart-content">';
            	$html += '<p class="no-items-in-cart">'+cartData.noItemLabel+'</p>';
              	$html += '</div>';
            }
          } 
          c.append($html);
        });
      }
      if($('.icon-cart-header .cart-count').length > 0){
      	$('.icon-cart-header .cart-count').html(cart.item_count);
      }
      if(frontendData.enableCurrency){
        currenciesCallbackSpecial('.cart-wrapper .cart-inner span.money');
      }
    },
    removeCartInit: function(id,r){ 
      $.ajax({
      	type: 'POST',
        url: '/cart/change.js',
        data:  'quantity=0&id='+id,
        dataType: 'json', 
        beforeSend: function() {
          $(".cartloading").show();
        },
        success: function(t) { 
          if ((typeof r) === 'function') {
            r(t);
          }else {
            ICO.collection.updateCartInfo(t, ".cart-container .cart-wrapper .cart-inner-content"); 
          	$(".cartloading").hide(); 
          }
        },
        error: function(XMLHttpRequest, textStatus) {
          Shopify.onError(XMLHttpRequest, textStatus);
        }
      }); 
    },
    shareCounts: function() {
      var shareCounts = $('.sf-share-counts'),
          facebookCount = shareCounts.find('a.sf-share-fb'),
          twitterCount = shareCounts.find('a.sf-share-twit'),
          pinterestCount = shareCounts.find('a.sf-share-pin'),
          linkedInCount = shareCounts.find('a.sf-share-linked'),
          pageHref = window.location.href.replace(window.location.hash, '');

      // Facebook
      if (facebookCount.length > 0) {
        $.getJSON('https://graph.facebook.com/?id='+ pageHref +'&callback=?', function(data) {
          if (data.shares !== undefined && data.shares !== null) {
            facebookCount.find('.count').html(data.shares);
          }
          facebookCount.find('.count').addClass('animate');
        });
      }

      // Twitter
      if (twitterCount.length > 0) {
        $.getJSON('https://urls.api.twitter.com/1/urls/count.json?url='+pageHref+'&callback=?', function(data) {
          if (data.count !== undefined && data.count !== null) {
            twitterCount.find('.count').html(data.count);
          }
          twitterCount.find('.count').addClass('animate');
        });
      }

      // LinkedIn
      if (linkedInCount.length > 0) {
        $.getJSON('https://www.linkedin.com/countserv/count/share?url='+pageHref+'&callback=?', function(data) {
          if (data.count !== undefined && data.count !== null) {
            linkedInCount.find('.count').html(data.count);
          }
          linkedInCount.find('.count').addClass('animate');
        });
      }

      // Pinterest
      if (pinterestCount.length > 0) {
        $.getJSON('https://api.pinterest.com/v1/urls/count.json?url='+pageHref+'&callback=?', function(data) {
          if (data.count !== undefined && data.count !== null) {
            pinterestCount.find('.count').html(data.count);
          }
          pinterestCount.find('.count').addClass('animate');
        });
      }

      body.on('click', '.sf-share-link', function() {
        window.open($(this).attr('href'));
        return false;
      });
    },
    sidebarMenuInit: function(){
      $("#mobile-menu, #categories_nav").mobileMenu({
        accordion: true,
        speed: 400,
        closedSign: 'collapse',
        openedSign: 'expand',
        mouseType: 0,
        easing: 'easeInOutQuad'
      });
    }, 
    sortbyFilter: function() {
      $(document).on("change", ".sort-by .field", function(e) {
        e.preventDefault();
        var t = $(this), i = t.val();
        Shopify.queryParams.sort_by = i;
        ICO.collection.filterAjaxRequest();
      });
    },
    limitedAsFilter: function(){
      $(document).on("change", ".limited-view .field", function(e) {
        e.preventDefault();
        var t = $(this), i = t.val();
        Shopify.queryParams.view = i;
        ICO.collection.filterAjaxRequest();
      });
    },
    swatchListFilter: function() {
      $(document).on("click", ".narrow-by-list .item:not(.disable)", function() {
        var e = $(this),
            t = e.find("input").val(),
            i = [];
        if (Shopify.queryParams.constraint && (i = Shopify.queryParams.constraint.split("+")), !e.hasClass("active")) {
          var a = e.parents(".layer-filter").find(".active");
          a.length > 0 && a.each(function() {
            var e = $(this).data("handle");
            if ($(this).removeClass("active"), e) {
              var t = i.indexOf(e);
              t >= 0 && i.splice(t, 1)
            }
          })
        }
        if (t) {
          var o = i.indexOf(t);
          0 > o ? (i.push(t), e.addClass("active")) : (i.splice(o, 1), e.removeClass("active"))
        } 
        i.length ? Shopify.queryParams.constraint = i.join("+") : delete Shopify.queryParams.constraint, ICO.collection.filterAjaxRequest()
      });
    },
    paginationActionInit: function(){
      $(document).on("click", ".pagination a", function(e) {
        e.preventDefault();
        var t = $(this);
        delete Shopify.queryParams.page, 
        delete Shopify.queryParams.constraint, 
        delete Shopify.queryParams.q, 
        delete Shopify.queryParams.sort_by, 
        ICO.collection.filterAjaxRequest(t.attr("href"));
      });
    },
    layerFilterInit: function() {
      ICO.collection.sortbyFilter();
      ICO.collection.limitedAsFilter();
      ICO.collection.paginationActionInit();
      ICO.collection.swatchListFilter();
      ICO.collection.layerClearAllFilter();
      ICO.collection.layerClearFilter(); 
    }, 
    filterCreateUrl: function(e) {
      var t = $.param(Shopify.queryParams).replace(/%2B/g, "+");
      return e ? "" != t ? e + "?" + t : e : location.pathname + "?" + t
    }, 
    filterAjaxRequest: function(e) {
      delete Shopify.queryParams.page;
      var t = ICO.collection.filterCreateUrl(e);
      ICO.collection.filterGetContent(t)
    },
    filterGetContent: function(e) {
      $.ajax({
        type: "get",
        url: e,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function(t) { 
          var i = t.match("<title>(.*?)</title>")[1]; 
          $("#collection-main").empty().html($(t).find("#collection-main").html()),
            $(".narrow-by-list").empty().html($(t).find(".narrow-by-list").html()), 
            $(".pagination").empty().html($(t).find(".pagination").html()), 
            $(".main-breadcrumbs").empty().html($(t).find(".main-breadcrumbs").html()),  
            History.pushState({
              param: Shopify.queryParams
            }, i, e), setTimeout(function() {
              $("html,body").animate({
                scrollTop: $(".toolbar").offset().top
              }, 500)
            }, 100);
          $("#resultLoading").hide();
          if (ICO.collection.readCookie('products-listmode') != null) {
            ICO.collection.layoutListInit();
          }
          ICO.collection.productGridSetup($(".products-grid")); 
          ICO.collection.layerClearFilter(); 
          ICO.collection.layerClearAllFilter();
          ICO.collection.colorSwatchGridInit();
          ICO.page.translateBlock('.main-wrapper');
          SPR.registerCallbacks();
          SPR.initRatingHandler();
          SPR.initDomEls();
          SPR.loadProducts();
          SPR.loadBadges();
          frontendData.enableCurrency && currenciesCallbackSpecial(".products-grid span.money"); 
        },
        error: function() {
          $("#resultLoading").hide();
        }
      });
    },
    layerClearFilter: function() {
      $(".narrow-by-list .narrow-item").each(function() {
        var e = $(this);
        e.find("input:checked").length > 0 && e.find(".clear").click(function(t) {
          var i = [];
          Shopify.queryParams.constraint && (i = Shopify.queryParams.constraint.split("+")), e.find("input:checked").each(function() {
            var e = jQuery(this),
                t = e.val();
            if (t) {
              var a = i.indexOf(t);
              a >= 0 && i.splice(a, 1)
            }
          }), i.length ? Shopify.queryParams.constraint = i.join("+") : delete Shopify.queryParams.constraint, ICO.collection.filterAjaxRequest(), t.preventDefault()
        })
      })
    }, 
    layerClearAllFilter: function() {
      $('.narrow-by-list').on("click", ".clearall", function(e) {
        e.preventDefault();
        delete Shopify.queryParams.constraint, delete Shopify.queryParams.q, ICO.collection.filterAjaxRequest();
      })
    }
  };
  
  ICO.productMediaManager = { 
    destroyZoom: function() {
      $('.zoomContainer').remove();
      $('.product-image-gallery .gallery-image').removeData('elevateZoom');
    },
    createZoom: function(image){
      ICO.productMediaManager.destroyZoom();
      if(isMobileAlt){
        return;
      }
      if(image.length <= 0) { //no image found
        return;
      }
      if(image[0].naturalWidth && image[0].naturalHeight) {
        var widthDiff = image[0].naturalWidth - image.width() - imageZoomThreshold;
        var heightDiff = image[0].naturalHeight - image.height() - imageZoomThreshold;

        if(widthDiff < 0 && heightDiff < 0) {
          //image not big enough
          image.parents('.product-image').removeClass('zoom-available'); 
          return;
        } else {
          image.parents('.product-image').addClass('zoom-available');
        }
      }
      if(dataZoom.position == 'inside'){
        image.elevateZoom({
          //gallery:'more-slides',
          zoomType: "inner",
          easing : true,
          cursor: "crosshair"
        });
      }else {
        image.elevateZoom({
          //gallery:'more-slides',
          zoomWindowPosition: dataZoom.position,
          easing : true
        });
      }
      if(dataZoom.lightbox) {
        image.bind("click", function(e) {  
          var ez =   image.data('elevateZoom');
          ez.closeAll();
          $.fancybox(ez.getGalleryList());
          return false;
        }); 
      }
    },
    swapImage: function(targetImage) {
      targetImage = $(targetImage);
      targetImage.addClass('gallery-image');

      ICO.productMediaManager.destroyZoom();

      var imageGallery = $('.product-image-gallery');

      if(targetImage[0].complete) { //image already loaded -- swap immediately

        imageGallery.find('.gallery-image').removeClass('visible');

        //move target image to correct place, in case it's necessary
        imageGallery.append(targetImage);

        //reveal new image
        targetImage.addClass('visible');

        //wire zoom on new image
        ICO.productMediaManager.createZoom(targetImage);

      } else { //need to wait for image to load

        //add spinner
        imageGallery.addClass('loading');

        //move target image to correct place, in case it's necessary
        imageGallery.append(targetImage);

        //wait until image is loaded
        imagesLoaded(targetImage, function() {
          //remove spinner
          imageGallery.removeClass('loading');

          //hide old image
          imageGallery.find('.gallery-image').removeClass('visible');

          //reveal new image
          targetImage.addClass('visible');

          //wire zoom on new image
          ICO.productMediaManager.createZoom(targetImage);
        });

      }
    },
    wireThumbnails: function() {
      //trigger image change event on thumbnail click
      $('.product-image-thumbs .thumb-link').click(function(e) {
        e.preventDefault();
        var jlink = $(this); 
        var target = $('#image-' + jlink.data('image-index')); 
        ICO.productMediaManager.swapImage(target);
      });
    },
    initZoom: function() {
        ICO.productMediaManager.createZoom($(".gallery-image.visible")); //set zoom on first image
    }, 
    init: function() {
      ICO.productMediaManager.imageWrapper = $('.product-img-box');
      // Re-initialize zoom on viewport size change since resizing causes problems with zoom and since smaller 
      $window.smartresize( function() {
        ICO.productMediaManager.initZoom();
      });
      ICO.productMediaManager.initZoom(); 
      ICO.productMediaManager.wireThumbnails();   
    }
  };

  ICO.verticleScroll = {
    init: function(){  
      if($('.product-img-box .verticl-carousel').length > 0){
        var carousel = $('.product-img-box .verticl-carousel'); 
        ICO.verticleScroll.carouselInit(carousel);
      }
    }, 
    carouselInit: function(carousel){
      var count = carousel.find('a').length; 
      if (count <= 3) {
        carousel.parents('.more-views-verticle').find('.more-views-nav').hide();
      }
      $(".product-img-box #carousel-up").on("click", function () {
        if (!$(".product-img-box .verticl-carousel").is(':animated')) {
          var bottom = $(".product-img-box .verticl-carousel > a:last-child");
          var clone = $(".product-img-box .verticl-carousel > a:last-child").clone();
          clone.prependTo(".product-img-box .verticl-carousel");
          $(".product-img-box .verticl-carousel").animate({
            "top": "-=85"
          }, 0).stop().animate({
            "top": '+=85'
          }, 250, function () {
            bottom.remove();
          });
          ICO.productMediaManager.init();
        }
      });
      $(".product-img-box #carousel-down").on("click", function () {
        if (!$(".product-img-box .verticl-carousel").is(':animated')) {
          var top = $(".product-img-box .verticl-carousel > a:first-child");
          var clone = $(".product-img-box .verticl-carousel > a:first-child").clone();
          clone.appendTo(".product-img-box .verticl-carousel");
          $(".product-img-box .verticl-carousel").animate({
            "top": '-=85'
          }, 250, function () {
            top.remove();
            $(".product-img-box .verticl-carousel").animate({
              "top": "+=85"
            }, 0);
          });
          ICO.productMediaManager.init();
        }
      });
    }
  }

  var infowindow, bounds, directory_bounds, mapTypeIdentifier = "", mapType, mapColor, mapSaturation, mapCenterLat, mapCenterLng, companyPos = "", isDraggable = true, latitude, longitude, mapCoordinates, markersArray = [], pinTitle, pinContent, pinLink, address, pinButtonText, pinLogoURL = "";
  ICO.map = {
    init:function() {

      var maps = $('.map-canvas');
      var mapContainer;

      if (typeof google !== 'undefined') {
        bounds = new google.maps.LatLngBounds();
      }

      maps.each(function(i, element) {
        mapContainer = element;
        var mapZoom = mapContainer.getAttribute('data-zoom'),
            mapControls = mapContainer.getAttribute('data-controls') == "yes" ? '' : 'no';
        mapType = mapContainer.getAttribute('data-maptype');
        mapColor = mapContainer.getAttribute('data-mapcolor');
        mapCenterLat = mapContainer.getAttribute('data-center-lat');
        mapCenterLng = mapContainer.getAttribute('data-center-lng');
        mapSaturation = mapContainer.getAttribute('data-mapsaturation');

        ICO.map.createMap( mapContainer, mapZoom, mapControls, mapType, mapColor, mapSaturation, jQuery(this));
      });

    },
    getLatLong: function(address, pintit, pinimage, fn) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        fn(results[0].geometry.location, results[0].geometry.location.lat(), results[0].geometry.location.lng() , pintit, pinimage);
      });
    },
    addWinContent: function(marker, html, map) {
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
      });
    },
    addMarker: function(mapInstance, pinLogoURL, pinTitle, pinContent, pinLink, address, pinButtonText) {
      var companyMarker;

      mapCoordinates = new google.maps.LatLng(latitude, longitude);

      if (pinLogoURL) {
        companyPos = new google.maps.LatLng(latitude, longitude);
        companyMarker = new google.maps.Marker({
          position: mapCoordinates,
          map: mapInstance,
          icon: pinLogoURL,
          animation: google.maps.Animation.DROP });
      } else {
        companyPos = new google.maps.LatLng(latitude, longitude);
        companyMarker = new google.maps.Marker({
          position: mapCoordinates,
          map: mapInstance,
          animation: google.maps.Animation.DROP });
      }

      var html = '<div class="pinmarker">';
      if (pinTitle !== "") {
        html += '<h3>'+pinTitle+'</h3>';
      }
      if (pinContent !== "") {
        html += '<p>'+pinContent+' </p>';
      }
      if (pinLink !== "" && pinButtonText !== "") {
        html += '<div><a href="' + pinLink + '" target="_blank">'+pinButtonText+'</a></div>';
      }
      html += '</div>';

      infowindow = new google.maps.InfoWindow();
      ICO.map.addWinContent(companyMarker, html, mapInstance);
      bounds.extend(mapCoordinates);
    },
    createMap: function(mapContainer, mapZoom, mapControls, mapType, mapColor, mapSaturation, targetMap) {

      if (google) {
        directory_bounds = new google.maps.LatLngBounds();
      }

      var pinLogoURL = "", mapLightness = false;

      // MAP STYLES
      var stylesArray = [],
          isStyled = false;

      if (jQuery(mapContainer).parent().find('.map-styles-array').length > 0) {
        isStyled = true;
        stylesArray = JSON.parse(jQuery(mapContainer).parent().find('.map-styles-array').text());
      } else {
        if (mapSaturation == "mono-light") {
          if (mapColor === "") {
            mapColor = "#ffffff";
          }
          mapSaturation = -100;
        } else if (mapSaturation == "mono-dark") {
          if (mapColor === "") {
            mapColor = "#222222";
          }
          mapSaturation = -100;
          mapLightness = true;
        } else {
          mapSaturation = -20;
        }
        stylesArray = [
          {
            stylers: [
              {hue: mapColor},
              {"invert_lightness": mapLightness},
              {saturation: mapSaturation}
            ]
          }
        ];
      }

      if (isMobileAlt) {
        isDraggable = false;
      }

      if (mapType === "satellite") {
        mapTypeIdentifier = google.maps.MapTypeId.SATELLITE;
      } else if (mapType === "terrain") {
        mapTypeIdentifier = google.maps.MapTypeId.TERRAIN;
      } else if (mapType === "hybrid") {
        mapTypeIdentifier = google.maps.MapTypeId.HYBRID;
      } else {
        mapTypeIdentifier = google.maps.MapTypeId.ROADMAP;
      }
      var options = {
        zoom: parseInt(mapZoom, 10),
        scrollwheel: false,
        draggable: isDraggable,
        mapTypeControl: true,
        disableDefaultUI: mapControls,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: mapTypeIdentifier,
        styles: stylesArray
      };

      var mapInstance = new google.maps.Map(mapContainer, options);
      var pincount = targetMap.parent().find('.pin_location').length;

      //Resize Window Responsiveness
      google.maps.event.addDomListener(window, 'resize', function() {
        mapInstance.fitBounds(bounds);
        mapInstance.setZoom(parseInt(mapZoom, 10));
      });

      bounds = new google.maps.LatLngBounds();
      targetMap.parent().find('.pin_location').each(function(i, element) {

        pinLogoURL = element.getAttribute('data-pinimage');
        pinTitle = element.getAttribute('data-title');
        pinContent = element.getAttribute('data-content');
        address = element.getAttribute('data-address');
        pinLink = element.getAttribute('data-pinlink');
        latitude = element.getAttribute('data-lat');
        longitude = element.getAttribute('data-lng');
        pinButtonText = element.getAttribute('data-button-text');


        if (latitude === '' && longitude === '') {

          ICO.map.getLatLong(address, pinTitle, pinLogoURL ,function(location, lati,longi, pintit, pinimage ){

            latitude = lati;
            longitude = longi;
            pinTitle = pintit;
            pinLogoURL = pinimage;

            ICO.map.addMarker(mapInstance, pinLogoURL, pinTitle, pinContent, pinLink, address, pinButtonText);

            if ( pincount > 1 ) {
              if(mapCenterLat !== '' && mapCenterLng !== ''){
                mapInstance.setZoom(parseInt(mapZoom, 10));
                mapInstance.setCenter(new google.maps.LatLng(mapCenterLat, mapCenterLng));
              }else{
                mapInstance.fitBounds(bounds);
              }
            } else {
              mapInstance.setZoom(parseInt(mapZoom, 10));
              mapInstance.setCenter(new google.maps.LatLng(latitude, longitude));
            }

          });

        } else {

          ICO.map.addMarker(mapInstance, pinLogoURL, pinTitle, pinContent, pinLink, address, pinButtonText);

          if ( pincount > 1 ) {
            if(mapCenterLat !== '' && mapCenterLng !== ''){
              mapInstance.setZoom(parseInt(mapZoom, 10));
              mapInstance.setCenter(new google.maps.LatLng(mapCenterLat, mapCenterLng));
            }else{
              mapInstance.fitBounds(bounds);
            }
          } else {
            mapInstance.setZoom(parseInt(mapZoom, 10));
            mapInstance.setCenter(new google.maps.LatLng(latitude, longitude));
          }

        }

      });
    }
  };
  var blogItems = $('.blog-wrap').find('.blog-items');
  ICO.instagram = {
    init: function(){
      blogItems.each(function() {
      	var blogInstance = $(this);
        if (blogInstance.hasClass('blog-grid-items')) {
          ICO.instagram.blogGrid(blogInstance.find('.grid-items'));
        }
      });
    },
    blogGrid: function(gridItems){
      var instagrams = gridItems.parent().find('.blog-instagrams');
      gridItems.imagesLoaded(function () {
        gridItems.isotope({
          resizable: false,
          itemSelector : '.blog-item',
          layoutMode: 'fitRows',
          getSortData : {
            id : function ( elem ) {
              return $(elem).data('sortid');
            }
          },
          sortBy: 'id',
          sortAscending: true
        });
        setTimeout(function() {
          gridItems.isotope('layout');
        }, 500);
        if (instagrams.length > 0) {
          ICO.instagram.blogGridInstagram(instagrams, gridItems);
        }
        gridItems.isotope('updateSortData').isotope();
        ICO.instagram.blogGridResize();
      }).animate({
        'opacity' : 1
      }, 800, 'easeOutExpo');

      $window.smartresize( function() {
        ICO.instagram.blogGridResize();
      });
    },
    blogGridResize: function() {
      blogItems.find('.grid-items').each(function() {
        var gridItem = $(this).find('.blog-item'),
            itemWidth = gridItem.first().width();
        if (gridItem.first().hasClass('col-sm-sf-25')) {
          itemWidth = itemWidth / 2;
        }
        gridItem.css('height', itemWidth);
      });
      setTimeout(function() {
        blogItems.find('.grid-items').isotope('layout');
      }, 500);
    },
    blogGridInstagram: function(instagrams, gridItems) {
      var userID = instagrams.data('userid'),
          token = instagrams.data('token'),
          count = instagrams.data('count');
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/users/"+userID+"/media/recent/?access_token="+token,
        success: function(data) {
          for (var i = 0; i < count; i++) {
            if (data.data[i]) {
              var caption = "";
              if (data.data[i].caption) {
                caption = data.data[i].caption.text;
              }
              instagrams.append("<li class='blog-item col-sm-ic-1 instagram-item' data-date='"+data.data[i].created_time+"' data-sortid='"+i*2+"'><a class='timestamp inst-icon' target='_blank' href='" + data.data[i].link +"'><i class='fa fa-instagram'></i></a><div class='inst-img-wrap'><div class='inst-overlay'><a target='_blank' href='" + data.data[i].link +"'></a><h2>"+caption+"</h2><div class='name-divide'></div><span class='date timeago' title='"+data.data[i].created_time+"' value=''>"+data.data[i].created_time+"</span></div><img class='instagram-image' src='" + data.data[i].images.low_resolution.url +"' /></div></li>");
            }
          }
          $("span.timeago").timeago();
          ICO.instagram.blogGridResize();
          instagrams.imagesLoaded(function(){
            gridItems.isotope('insert', $(instagrams.html()));
            ICO.instagram.blogGridResize();
          });
          gridItems.isotope('updateSortData').isotope();
        }
      });
    }
  }
  
  ICO.blog = {
    init: function(){
      if($('.blog-article-wrap .owl-carousel').length > 0){
        var blogArticle = $('.owl-carousel');
        blogArticle.each(function(){
          ICO.blog.articleCarouselInit($(this));
        });
      }
    },
    articleCarouselInit: function(blogArticle){
      var carouselData = blogArticle.parent().find('data-carousel');
      if(carouselData.data('auto')) {
        var autoplay = carouselData.data('auto');
      }else{
        var autoplay = false;
      }
      blogArticle.owlCarousel({
        items: carouselData.data('items'), 
        slideSpeed: 500,
        autoPlay: autoplay,
        pagination: carouselData.data('paging'),
        addClassActive: true,
        navigation: carouselData.data('nav'),
        navigationText: [carouselData.data('prev'),carouselData.data('next')]
      }); 
    }
  };

  ICO.footer = {
    init: function() {
      ICO.footer.backToTopInit();
      ICO.footer.mobileAccordionInit();
    },
    backToTopInit: function() {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('#back-top').fadeIn();
        } else {
          $('#back-top').fadeOut();
        }
      });
      $('#back-top a').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    },
    mobileAccordionInit: function() {
      $('.mobile-button').addClass("active");
      $('.mobile-button').click(function(){
        if($(this).parents('.footer-block-title, .block-title').next().is(":visible")){
          $(this).addClass("active");
        }else{
          $(this).removeClass("active");
        }
        $(this).parents('.footer-block-title, .block-title').next().toggle(400);
      });
    }
  };
  ICO.onReady = {
    init: function() {
      ICO.header.init();
      ICO.page.init();
      ICO.collection.init(); 
      ICO.blog.init();
      ICO.footer.init();
      ICO.verticleScroll.init();
      ICO.productMediaManager.init();
      ICO.instagram.init();
    }
  };
  ICO.onLoad = {
    init: function() { 
      ICO.map.init();
    }
  }; 
  $(document).ready(function(){
    ICO.onReady.init();
  });
  $(window).load(function(){
    ICO.onLoad.init();
  });
})(jQuery); 
function mobileSkipLink(e){
    var skipContents = jQuery('.skip-content');
    var skipLinks = jQuery('.skip-link');
    var self = jQuery(e);
    var target = self.attr('data-target-element');
    // Get target element
    var elem = jQuery(target);
    // Check if stub is open
    var isSkipContentOpen = elem.hasClass('skip-active') ? 1 : 0;
    // Hide all stubs
    skipLinks.removeClass('skip-active');
    skipContents.removeClass('skip-active');
    self.removeClass('skip-active');
    // Toggle stubs
    if (isSkipContentOpen) {
        self.removeClass('skip-active');
    } else {
        self.addClass('skip-active');
        elem.addClass('skip-active');
    }
}