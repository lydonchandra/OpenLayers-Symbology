/**
* @requires ol.thematic.js, colorbrewer.js
*/

ol.thematic.Choropleth = OpenLayers.Class( ol.thematic.LayerBase, 
{
	
	colorScheme 		: 'YlGn',
	method 				: ol.thematic.Distribution.CLASSIFY_BY_QUANTILE,
	numClasses 			: 5,
	defaultSymbolizer 	: { 'fillOpacity' : 1 },
	classification 		: null,
	colorInterpolation 	: null,
	
	initialize : function( map, options )
	{
		ol.thematic.LayerBase.prototype.initialize.apply( this, arguments );
	},
	
	updateOptions : function( newOptions )
	{
		var oldOptions = OpenLayers.Util.extend( {}, this.options );
		this.addOptions( newOptions );
		if ( newOptions )
		{
			// new classification?
			if (newOptions.method != oldOptions.method ||
	                newOptions.indicator != oldOptions.indicator ||
	                newOptions.numClasses != oldOptions.numClasses) 
	     	{
	                this.setClassification();
	                
	        // new colors?
	      	} else if (newOptions.colorScheme && newOptions.colorScheme != oldOptions.colorScheme )
	    	{
	        	this.createColorInterpolation();
	    	}
		}
	},
	
	
	createColorInterpolation: function() {
		var numColors = this.classification.bins.length;
		this.colorInterpolation = colorbrewer[ this.colorScheme ][ numColors ];
	},


	setClassification : function() 
	{
		alert('donkey dong');
		var values = [];
		var features = this.layer.features;
		for (var i = 0; i < features.length; i++) 
		{
			values.push(features[i].attributes[this.indicator]);
		}
		var dist = new ol.thematic.Distribution(values);
		this.classification = dist.classify(
			this.method,
			this.numClasses,
			null
		);
		
		this.createColorInterpolation();
	},
	
	applyClassification : function( options )
	{
		alert( 'apply classssy' );
		this.updateOptions(options);
		var boundsArray = this.classification.getBoundsArray();
		var rules = new Array(boundsArray.length - 1);
		for (var i = 0; i < boundsArray.length -1; i++) 
		{
			var rule = new OpenLayers.Rule(
			{
				symbolizer : { fillColor : "#000" },
				/*
				symbolizer: {fillColor: this.colorInterpolation[i].toHexString()},
				*/
				filter: new OpenLayers.Filter.Comparison(
				{
					type: OpenLayers.Filter.Comparison.BETWEEN,
					property: this.indicator,
					lowerBoundary: boundsArray[i],
					upperBoundary: boundsArray[i + 1]
				})
			});
			rules[i] = rule;
		}
		this.extendStyle(rules);
		ol.thematic.LayerBase.prototype.applyClassification.apply(this, arguments);
		
		alert('applied: ' + this.layer.features);
	},
	
	CLASS_NAME: "ol.thematic.Choropleth"
});