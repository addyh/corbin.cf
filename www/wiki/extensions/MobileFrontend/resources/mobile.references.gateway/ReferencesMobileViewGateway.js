( function ( M, $ ) {
	var moduleName = 'mobile.references.gateway/ReferencesMobileViewGateway',
		ReferencesHtmlScraperGateway =
		M.require( 'mobile.references.gateway/ReferencesHtmlScraperGateway' ),
		cache = M.require( 'mobile.startup/cache' ),
		ReferencesGateway = M.require( 'mobile.references.gateway/ReferencesGateway' ),
		MemoryCache = cache.MemoryCache,
		NoCache = cache.NoCache,
		referencesMobileViewGateway = null;

	/**
	 * Gateway for retrieving references via the MobileView API
	 *
	 * By default not cached, if it receives a cache instance then it will be
	 * used to store and get references sections.
	 *
	 * @class ReferencesMobileViewGateway
	 * @extends ReferencesHtmlScraperGateway
	 * @inheritdoc
	 *
	 * @constructor
	 * @param {mw.Api} api class to use for making requests
	 * @param {NoCache|MemoryCache} [cache] class to use for caching request
	 * results. By default it uses the NoCache implementation, which doesn't
	 * cache anything. The singleton instance exposed by this module uses
	 * a MemoryCache which caches requests in-memory. Any other Cache class
	 * compatible with mobile.cache's interface will actually work.
	 */
	function ReferencesMobileViewGateway( api, cache ) {
		ReferencesHtmlScraperGateway.call( this, api );
		this.cache = cache || new NoCache();
	}

	OO.mfExtend( ReferencesMobileViewGateway, ReferencesHtmlScraperGateway, {
		/**
		 * Retrieve references list for a given page.
		 * Also cache the result for a later use.
		 *
		 * @method
		 * @param {Page} page
		 * @return {jQuery.Promise} promise that resolves with the list of
		 *  sections on the page
		 */
		getReferencesLists: function ( page ) {
			var self = this,
				result = $.Deferred(),
				cachedReferencesSections = this.cache.get( page.id );

			if ( cachedReferencesSections ) {
				return result.resolve( cachedReferencesSections ).promise();
			}

			this.api.get( {
				action: 'mobileview',
				page: page.getTitle(),
				sections: 'references',
				prop: 'text',
				revision: page.getRevisionId()
			} ).then( function ( data ) {
				var sections = {};

				data.mobileview.sections.forEach( function ( section ) {
					var $section = $( '<div>' ).html( section.text );

					sections[ $section.find( '.mw-headline' ).attr( 'id' ) ] = $section.find( '.references' );
				} );

				self.cache.set( page.id, sections );

				result.resolve( sections );
			} ).fail( function () {
				result.reject( ReferencesGateway.ERROR_OTHER );
			} );

			return result.promise();
		},
		/**
		 * Retrieve all the references lists for a given page and section ID.
		 *
		 * @method
		 * @param {Page} page
		 * @param {string} headingId
		 * @return {jQuery.Promise} promise that resolves with the section
		 *  HTML or `false` if no such section exists
		 */
		getReferencesList: function ( page, headingId ) {
			return this.getReferencesLists( page ).then( function ( data ) {
				return data.hasOwnProperty( headingId ) ? data[ headingId ] : false;
			} );
		},
		/**
		 * @inheritdoc
		 */
		getReference: function ( id, page ) {
			var self = this;

			return this.getReferencesLists( page ).then( function ( sections ) {
				var $container = $( '<div>' );

				Object.keys( sections ).forEach( function ( sectionId ) {
					$container.append( sections[ sectionId ] );
				} );

				return self.getReferenceFromContainer( id, $container );
			} );
		}
	} );

	/**
	 * Retrieve a singleton instance w/ cache that uses mw.Api
	 * @static
	 * @return {ReferencesMobileViewGateway}
	 */
	ReferencesMobileViewGateway.getSingleton = function () {
		if ( !referencesMobileViewGateway ) {
			referencesMobileViewGateway = new ReferencesMobileViewGateway(
				new mw.Api(),
				new MemoryCache()
			);
		}
		return referencesMobileViewGateway;
	};

	M.define( moduleName, ReferencesMobileViewGateway ); // resource-modules-disable-line

}( mw.mobileFrontend, jQuery ) );
