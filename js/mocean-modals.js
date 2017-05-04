;(function(window){

	var
		// Is Modernizr defined on the global scope
		Modernizr = typeof Modernizr !== "undefined" ? Modernizr : false,

		// Always expect both kinds of event
		buttonPressedEvent = 'touchstart click',

		// List of all animation/transition properties
		// with its animationEnd/transitionEnd event
		animationEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},

		transitionEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},

		Mocean = function() {
			this.init();
		};

	// Current version.
	Mocean.version = '0.0.1';

	// Initialization method
	Mocean.prototype.init = function() {
		this.buttonPressedEvent = buttonPressedEvent;

		//event trigger after animation/transition end.
		this.transitionEndEventName = Modernizr ? transitionEndEventNames[Modernizr.prefixed('transition')] : getTransitionEndEventNames();
		this.animationEndEventName  = Modernizr ? animationEndEventNames[Modernizr.prefixed('animation')] : getAnimationEndEventNames();
		this.transitionAnimationEndEvent = this.animationEndEventName + ' ' + this.transitionEndEventName;
	};

	Mocean.prototype.getViewportHeight = function() {

		var docElement = document.documentElement,
				client     = docElement['clientHeight'],
				inner      = window['innerHeight'];

		if( client < inner )
			return inner;
		else
			return client;
	};

	// Get all the properties for transition/animation end
	function getTransitionEndEventNames() {
		return _getEndEventNames( transitionEndEventNames );
	}

	function getAnimationEndEventNames() {
		return _getEndEventNames( animationEndEventNames );
	}

	function _getEndEventNames(obj) {
		var events = [];

		for ( var eventName in obj ) {
			events.push( obj[ eventName ] );
		}

		return events.join(' ');
	}

	// Creates a Mocean object.
	window.Mocean = new Mocean();

})(this);



// ========================================
// Mocean Modal Effects v1.0.0
// ========================================

;(function(window) {

	var Mocean = window.Mocean;

	var MoceanModal = function() {
		if ( !(this instanceof MoceanModal) ) {
			return new MoceanModal();
		}

		this.init();
	};

	MoceanModal.version = '0.0.1';

	MoceanModal.prototype.init = function() {
		this.$body               = $('body');
		this.$element            = null;
		this.$overlay            = null;
		this.isShown             = false;
		this.hasPerspective      = false;
		this.modalMocean         = '';
		this.modalMoceanOut      = '';
		this.modalMoceanProvided = true;
		this.bindUIActions();
	};

	MoceanModal.prototype.bindUIActions = function() {
		$(document).on( Mocean.buttonPressedEvent,
										'.mocean-modal-button',
										$.proxy(this.open, this)
									);

		$(document).on( Mocean.buttonPressedEvent,
										'.mocean-modal-close, [data-mocean-dismiss="modal"]',
										$.proxy(this.close, this)
									);

		var self = this;

		$(window).on( 'keyup', function( e ) {
			if ( e.keyCode === 27 ) self.close(e);
		});
	};

	MoceanModal.prototype.open = function( e ) {
		e.preventDefault();

		if ( this.isShown ) {
			return;
		}

		var $button = $(e.target),
				target  = $button.data('mocean-target');

		this.$element = $(target || '#mocean-modal-wrap');

		if ( !this.$element.length ) return;

		// Mocean Modal Type
		this.modalMocean     = $button.data( 'mocean-type' );
		this.modalMoceanOut  = $button.data( 'mocean-out-type' );

		if ( $button.data( 'mocean-needs-perspective' ) ) {
			this.$body.addClass( 'mocean-perspective' );
			this.hasPerspective = true;
		}

		// check if the mocean class is already added
		if ( this.$element.hasClass( this.modalMocean ) || this.modalMocean === undefined ) {
			this.showModal();
		} else {
			this.modalMoceanProvided = false;
			this.$element.addClass( this.modalMocean );

			this.$element.on( Mocean.transitionAnimationEndEvent, $.proxy(function() {
				this.$element.off( Mocean.transitionAnimationEndEvent );
				this.showModal();
			}, this));
		}
	};

	MoceanModal.prototype.close = function( e ) {
		e.preventDefault();

		if ( !this.isShown ) {
			return;
		}

		this.$element.on( Mocean.transitionAnimationEndEvent, $.proxy(function () {
			this.$element.off( Mocean.transitionAnimationEndEvent );
			this.hideModal();
		}, this));

		this.$element.removeClass( 'mocean-show' );
		this.isShown = false;

		if ( this.modalMoceanOut ) {
			this.$element.addClass( this.modalMoceanOut );
		}
	};

	MoceanModal.prototype.showModal = function() {
		this.addOverlay();
		this.$element.addClass( 'mocean-show' );
		this.isShown = true;
	};

	MoceanModal.prototype.hideModal = function() {
		if ( this.modalMoceanOut ){
			this.$element.removeClass( this.modalMoceanOut );
			this.modalMoceanOut = '';
		}

		if ( this.hasPerspective ) {
			this.$body.removeClass( 'mocean-perspective' );
			this.hasPerspective = false;
		}

		this.removeOverlay();
		this.$element.removeClass( this.modalMocean );
		this.modalMocean = '';
	}

	MoceanModal.prototype.addOverlay = function() {
		var atts = [];

		atts.push('class="mocean-overlay mocean-modal-overlay"');
		atts.push('id="mocean-modal-overlay"');
		atts.push('data-mocean-dismiss="modal"')

		this.$overlay = $('<div ' + atts.join(' ') + ' />').insertAfter( this.$element );
		this.$overlay[0].offsetWidth;
	};

	MoceanModal.prototype.removeOverlay = function() {
		this.$overlay.remove();
		this.$overlay = null;
	};

	window.Mocean.Modal = MoceanModal();

})(this);
