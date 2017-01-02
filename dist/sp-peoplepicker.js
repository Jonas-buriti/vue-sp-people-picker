(function (Vue, jQuery, pnp, R) {
    'use strict';
    Vue.component('sp-peoplepicker', {
        template:'<input autocomplete="off" :class="[\'form-control\', customClass]" type="text" v-model="value"/>',
        props: {
            listInternalName: { type: String },
            listGuid: { type: String },
            storeKey: { type: String },
            model: [Object, Array],
            valueField: { type: [String], default: 'Id' },
	        displayField: { type: [String], default: 'Title' },
	        customClass: { type: [String], default: '' },
            filter: { type: String },
            onChange: { type: Function, default: function (val) { } },
            minLength: { type: Number, default: 1 },
            maxResults: { type: Number, default: 10 },
            user:{type: Number}
        },
        mounted: function () {
        	this.applyAutoComplete();
            if(this.user){                
                this.loadDisplayVal(this.user)
            }
        },
        data: function () {
            return {
                value: undefined,
                results: []
            };
        },
        methods: {
        	applyAutoComplete: function () {
        		this.getInput()
	                .typeahead('destroy')
	                .typeahead({ hint: false, highlight: true, minLength: this.minLength },{
	                    source: this.debounce(this.applySearch.bind(this), 700),
	                    displayKey: this.displayField,
	                    limit: this.maxResults
	                })
	                .on('typeahead:change', function (e, data) {
	                    if (!this.getValue(data)) {
	                        Vue.delete(this.model, this.storeKey);
	                        Vue.set(this, 'value', '');
	                    }
	                    this.onChange(this.model);
	                }.bind(this))
	                .on('typeahead:selected typeahead:autocomplete', function (e, data) {
	                    Vue.set(this.model, this.storeKey, data[this.valueField] || null);
	                    Vue.set(this, 'value', data[this.displayField] || null);
	                }.bind(this));
	            this.onChange(this.model);
        	},
            applySearch:function (query, sync, async) {                
                Promise.all([this.fetchGroupData(query) ,this.fetchData(query)])
                    .then(function (responses) {                        
                        var ret = async([].concat(responses[0], responses[1]) || []);
                        this.storeResults([].concat(responses[0], responses[1]) || []);
                        return ret;
                    }.bind(this))
            },
        	getFilter: function (query) {
        		return "substringof('" + query + "', LoginName) or substringof('" + query + "', Title)";
        	},
        	storeResults: function (data) {
        		Vue.set(this, 'results', data);
        	},
            fetchData: function (query) {
	    		return pnp.sp.web.siteUsers.filter(this.getFilter(query)).get();
	    	},
            fetchGroupData: function (query) {
	    		return pnp.sp.web.siteGroups.filter(this.getFilter(query)).get();
	    	},
	    	getDataByID: function (id) {
	    		return pnp.sp.web.siteUsers.getById(id).get(); 
	    	},
            getGroupByID: function (id) {                
	    		return pnp.sp.web.siteGroups.getById(id).get();
	    	},
            getValue: function (displayVal) {
                if (!this.results.length || !this.displayField) return null;
                return R.head(this.results.filter(function (obj) { 
                        return obj[this.displayField].toUpperCase() === displayVal.toUpperCase(); 
                }.bind(this)))[this.displayField];
            },
            getInput: function () {
                return jQuery(this.$el);
            },
            loadDisplayVal: function (id, isGroup) {
                if ((this.model[this.storeKey] && !this.value) || id) {
                    (isGroup ? this.getGroupByID(id || this.model[this.storeKey]) : this.getDataByID(id || this.model[this.storeKey]))
                    .then(function (d) {
                        this.getInput().typeahead('val', d[this.displayField] || '');
                    }.bind(this))
                    .catch(function(error){                        
                        this.loadDisplayVal(id, true)
                    }.bind(this));
                }
            }, 
            debounce: function (func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            }
        },  
        watch: {
			'model.value': {
				handler: function (val) {
					this.loadDisplayVal();
				},
				deep: true
			}
		}        
    })
})(Vue, jQuery, $pnp, R);