(function (Vue, R, pnp, VueSelect) {
	pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });

	Vue.component('v-sp-people-picker', {
		props: {
			model: { type: [Array] },
			property: { type: String },
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
