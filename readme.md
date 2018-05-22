# vue-sp-people-picker
A Vue.js/PnP.js based SharePoint people picker component.

## Usage
#### Browser Globals

##### Dependencies
[VueJs](https://vuejs.org/)
[Vue Select](https://sagalbot.github.io/vue-select/)
[Pnp js](https://github.com/SharePoint/PnP-JS-Core)

##### Using
```html
<script src="/scripts/vue-sp-file-uploader.js"></script>
```
Then use the component in your javascript:

```js
new Vue({
    el: '#app',
    data: {
        selectedPeople: []
    },
    template: 
    '<div>\
        <v-sp-people-picker :model="selectedPeople" /> 
    </div>'
});
