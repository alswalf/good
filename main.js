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
                    <option v-for="(event, key) in this.eventsList" :value="key" :key="key">{{ this.texts[key] }}</option>
                </select>
                <div id="alliance_toggle">
                    <button @click="this.toggleAllianceRanking" :class="[this.alliance_ranking ? '' : 'active']">{{ this.texts.player }}</button>
                    <button @click="this.toggleAllianceRanking" :class="[this.alliance_ranking ? 'active' : '']">{{ this.texts.dialog_alliance_name_default }}</button>
                </div>
            </div>

            <div id="content">
                <div id="navigate_buttons">
                    <button @click="this.firstPage"><img src="assets/double_arrow_up.svg" alt="first page"/></button>
                    <button @click="this.previousPage"><img src="assets/arrow_up.svg" alt="previous page"/></button>
                    <button @click="this.nextPage"><img src="assets/arrow_up.svg" alt="next page" style="transform:rotate(180deg);"/></button>
                    <button @click="this.lastPage"><img src="assets/double_arrow_up.svg" alt="last page" style="transform:rotate(180deg);"/></button>
                </div>
                <table id="table">
                    <colgroup>
                        <col class="small_column">
                        <col>
                        <col v-if="!this.currentCategory.isCurrentOuter">
                        <col class="small_column" v-if="this.hasPoints">
                        <col class="small_column" v-if="this.hasMedals && !this.alliance_ranking">
                        <col v-if="this.hasMedals">
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="small_column">{{ this.texts.rank }}</th>
                            <th>{{ this.texts.dialog_highscore_name }}</th>
                            <th v-if="!this.currentCategory.isCurrentOuter">{{ this.alliance_ranking ? this.texts.dialog_alliance_member : this.texts.dialog_alliance_name_default }}</th>
                            <th class="small_column" v-if="this.hasPoints">{{ this.texts.points_noValue }}</th>
                            <th v-if="this.hasMedals && !this.alliance_ranking">{{ this.texts.dialog_fame_rankTitle }}</th>
                            <th v-if="this.hasMedals">{{ this.texts.dialog_seasonLeague_medalsOverviewDialog_header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, index) in this.players" :key="index">
                            <td>&lrm;{{ this.currentCategory.isCurrentOuter ? player[this.offset(4)] : this.formatNumber(player[this.offset(0)]) }}</td>
                            <td>{{ this.currentCategory.isCurrentOuter ? player[this.offset(3)] : player[this.offset(2)]?.[this.alliance_ranking ? 1 : 'N'] }}</td>
                            <td v-if="!this.currentCategory.isCurrentOuter">{{ player[this.offset(2)]?.[this.alliance_ranking ? 2 : 'AN'] }}</td>
                            <td v-if="this.hasPoints">&lrm;{{ this.formatNumber(player[this.offset(1)]) }}</td>
                            <td v-if="this.hasMedals && !this.alliance_ranking" class="title" :title="this.texts['seasonLeague_rank_' + player[this.offset(2)]?.KLRID]">
                                <img :src="'assets/title_' + (player[this.offset(2)]?.KLRID - 1 >> 2) + '.png'" alt="title"/>
                                <img v-if="(player[this.offset(2)]?.KLRID ?? 1) % 4 != 1" :src="'assets/title_level_' + (player[this.offset(2)].KLRID - 1) % 4  + '.png'" alt="title level"/>
                            </td>
                            <td v-if="this.hasMedals" class="medal">
                                <div><p>{{ this.nbMedals(player, 1) }}</p><img src="assets/medal_gold.png" alt="gold medal"/></div>
                                <div v-if="this.nbMedals(player, 2) > 0"><p>{{ this.nbMedals(player, 2) }}</p><img src="assets/medal_silver.png" alt="silver medal"/></div>
                                <div v-if="this.nbMedals(player, 3) > 0"><p>{{ this.nbMedals(player, 3) }}</p><img src="assets/medal_bronze.png" alt="bronze medal"/></div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr v-if="this.nbCategories > 1">
                            <td id="category" colspan="10">
                                <div class="flexc" style="margin-right: 25px;">
                                    <button @click="this.previousCategory"><img src="assets/arrow_up.svg" alt="next category"_
