var sampleData = [];
let discordData = Vue.reactive({sampleData});
const app = Vue.createApp({
  data() {
    return {
      state: discordData
    };
  }
});
app.mount('#app');