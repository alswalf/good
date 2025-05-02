const app = Vue.createApp({
    data() {
        return {
            proxy: "https://sheltered-everglades-24913.fly.dev/",
            languages: [],
            servers: {},
            events: {},
            texts: {},
            players: [],
            current_language: 'fr',
            current_server_header: 'EmpireEx_3',
            current_event_name: window.sessionStorage.getItem('event') ?? '',
            current_category_index: window.sessionStorage.getItem('category') ?? 0,
            current_search: window.sessionStorage.getItem('search') ??  1,
            last_rank: 1,
            alliance_ranking: !!window.sessionStorage.getItem('alliance') ?? false
        }
    },

    async mounted() {
        await this.getLanguages();
        if (this.languages.includes(window.localStorage.getItem('language'))) {
            this.current_language = window.localStorage.getItem('language');
        }
        await this.changeLanguage();

        let sockets_file = await fetch(`${this.proxy}https://empire-html5.goodgamestudios.com/config/network/1.xml`);
        sockets_file = new DOMParser().parseFromString(await sockets_file.text(), 'text/xml');
        for (let instance of sockets_file.firstChild.firstChild.children) {
            if (instance.children[2].textContent != "EmpireEx_23") {
                this.servers[instance.children[2].textContent] = {
                    name: instance.children[6].textContent,
                    id: instance.children[4].textContent
                };
            }
        }
        if (window.localStorage.getItem('server') in this.servers) {
            this.current_server_header = window.localStorage.getItem('server');
        }
        const response = await fetch("events.json");
        this.events = await response.json();
        if (!Object.keys(this.eventsList).includes(this.current_event_name)) {
            this.current_event_name = Object.keys(this.eventsList)[0];
            this.current_category_index = 0;
            this.current_search = 1;
        }
        if (this.current_category_index > this.nbCategories) {
            this.current_category_index = 0;
            this.current_search = 1;
        }

        await this.getRankingsByRank();
    },

    template:
    /*html*/
    `
    <div class="wrapper">
        <div class="gradientBar"></div>
        <div class="contentCreater flexc">Made by  <a class="creater" href="https://empire.goodgamestudios.com/"><strong>سيرفر</strong>السعودي</a> ضرغام</div>
        <h1 class="flexc"><img src="./assets/nlogo.png"/></h1>
        <section :style="{direction: this.current_language == 'ar' ? 'rtl' : 'ltr'}">
            <select class="flexc" id="languages" v-model="this.current_language" @change="changeLanguage">
                <option v-for="language in languages" :value="language" :key="language">{{ this.texts["language_native_" + language.toLowerCase()] }}</option>
            </select>

            <div class="tableNavbar flexc">
                <select id="servers" v-model="this.current_server_header" @change="changeServer">
                    <option v-for="(server, key) in this.servers" :value="key" :key="key">{{ this.texts[server.name] + " " + server.id }}</option>
                </select>
                <select id="events" v-model="this.current_event_name" @change="changeEvent">
                    <option v-for
