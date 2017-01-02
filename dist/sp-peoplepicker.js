var spPeoplePickerComponent = (function (Vue, jQuery, pnp, R) {
    'use strict';
    var component = {
        template:
        '<input autocomplete="off" :class="[\'form-control\', customClass]" type="text" v-model="value"/>',
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
            maxResults: { type: Number, default: 10 }
        },
        mounted: function () {
        	this.applyAutoComplete();
        },
        data: function () {
            var _data = {
                value: undefined,
                results: []
            };
            return _data;
        },
        methods: {
        	applyAutoComplete: function () {
        		this.getInput()
	                .typeahead('destroy')
	                .typeahead({ hint: false, highlight: true, minLength: this.minLength },
	                {
	                    source: this.debounce(function (query, sync, async) {
	                        this.fetchData(query)
	                            .then(function (d) {
	                                var ret = async(d || []);
	                                this.storeResults(d);
	                                return ret;
	                            }.bind(this));
	                    }.bind(this), 700),
	                    displayKey: this.displayField,
	                    limit: this.maxResults
	                })
	                .on('typeahead:change', function (e, data) {
	                    if (!this.getValue(data)) {
	                    	//clean if is a invalid value
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
        	getFilter: function (query) {
        		return "substringof('" + query + "', LoginName) or substringof('" + query + "', Title)";
        	},
        	storeResults: function (data) {
        		Vue.set(this, 'results', data);
        	},
            fetchData: function (query) {
	    		return pnp.sp.web.siteUsers.filter(this.getFilter(query)).get();
	    	},
	    	getDataByID: function (id) {
	    		return pnp.sp.web.siteUsers.getById(id).get();
	    	},
            getValue: function (displayVal) {
                if (!this.results.length) return null;
                return R.head(this.results.filter(function (obj) { return obj[this.displayField].toUpperCase() === displayVal.toUpperCase(); }.bind(this)))[this.displayField];
            },
            getInput: function () {
                return jQuery(this.$el);
            },
            loadDisplayVal: function () {
            	if (this.model[this.storeKey] && !this.value) {
                    this.getDataByID(this.model[this.storeKey]).then(function (d) {
                        this.getInput().typeahead('val', d[this.displayField] || '');
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
    };
    return component;
})(Vue, jQuery, $pnp, R);