(function (Vue, R, pnp, VueSelect) {
	pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });

	Vue.component('peoplepicker', {
		props: {
			model: { type: [Array] },
			property: { type: String },
			removeMethod: { type: String },
			multiple: { type: Boolean, default: true },

		},
		components: {
            'v-select': VueSelect.VueSelect
        },
		data: function () {
			return {
				options: [],
				sourceId: 'b09a7990-05ea-4af9-81ef-edfab16c4e31',
				selected: [],
				dataKey: 'AccountName',
				multLoaded: false
			};
		},
		created: function () {

		},
		methods: {
			search: function (query) {
				return $pnp.sp.search({
					Querytext: query,
					SourceId: this.sourceId,
					RowLimit: 50
				});
			},
			onSearch: function (term, loading) {
				loading(true);
				this.search("PreferredName:*"+ term +"* OR AccountName:*"+ term +"*")
					.then(this.applySearch)
					.then(function () {
						loading(false);
					});
			},
			applySearch: function (data) {
				Vue.set(this, 'options', data.PrimarySearchResults);
			},
			applyInitialData: function (val) {
				if (!this.multLoaded && !this.selected.length) {
                    this.multLoaded = true;
                    
                    var query = val.reduce(function (arr, current) {
                    	if(current.ACCOUNT_NAME)
                    		arr.push('AccountName="' + current.ACCOUNT_NAME.replace('\\','\\\\') + '"');
                    	return arr;
                    },[]);
                    if(query.length) {
                    	this.search(query.join(" OR "))
						.then(function (data) {
							Vue.set(this, 'model', data.PrimarySearchResults);
						}.bind(this));
                    }
                    this.multLoaded = true;                    
                } else {
                	this.multLoaded = true;
                }
            }
		},
		watch: {
            'model': function (val) {
                this.applyInitialData(val);
            }
        },
		template:
		'<div class="btn-toolbar">\
			<v-select\
				:debounce="250"\
				:on-search="onSearch"\
				:options="options"\
				:multiple="multiple"\
				:value.sync="model"\
				label="PreferredName"\
			>\
			</v-select>\
		</div>'
	});
})(Vue, R, $pnp, VueSelect);
