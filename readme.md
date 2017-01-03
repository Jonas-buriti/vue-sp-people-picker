# vue-sp-people-picker
A Vue.js/PnP.js based SharePoint people picker component.

## Usage
#### Browser Globals

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.8/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sp-pnp-js/1.0.6/pnp.min.js"></script>
<script src="/scripts/vue-sp-file-uploader.js"></script>
```
Then use the component in your javascript:

```js
new Vue({
    el: '#app',
    data: {
        fields: {
            field1: null
        }
    },
    components: {
        'sp-peoplepicker': spPeoplePickerComponent
    },
    template: 
    '<div>\
        <sp-peoplepicker \
            :model="fields"\
            store-key="field1"/>\
    </div>'
});