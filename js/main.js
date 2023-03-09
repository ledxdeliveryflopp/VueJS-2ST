let eventBus = new Vue()

Vue.component('column', {
    // колонки
    template: `
 
        <div class="columns">
            <newCard></newCard>
        <p class="error" v-for="error in errors">{{ error }}</p>
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
            </div>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            errors: [],
        }
    },
    mounted() {
        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
            } else {
                this.errors.length = 0
                this.errors.push('макс коллво заметок в 1 столбце')
            }
    })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.errors.length = 0
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
            } else {
                this.errors.length = 0
                this.errors.push('Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.')
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
                this.column_3.push(ColumnCard)
                this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)

        })

    }
})

Vue.component('newCard', {
        template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
            <p class="main_text">Заметки</p>
        <div class="form_control">
                
            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>

            <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>

            <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
            <br>
            <input required type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
            <br>
             <input required type="text" v-model="point_5"  placeholder="Пятый пункт"/>
        </div>
            <div class="form_control">
                <button class="btn">Отправить</button>
            </div>
        </form>
    </section>
    `,
        data() {
            return {
                name: null,
                point_1: null,
                point_2: null,
                point_3: null,
                point_4: null,
                point_5: null,
                date: null,
            }
        },
        methods: {

            Submit() {
                    let card = {
                        name: this.name,
                        points: [
                            {name: this.point_1, completed: false},
                            {name: this.point_2, completed: false},
                            {name: this.point_3, completed: false},
                            {name: this.point_4, completed: false},
                            {name: this.point_5, completed: false}
                        ],
                        date: null,
                        // date: null,
                        status: 0,
                        errors: [],
                    }
                    eventBus.$emit('addColumn_1', card)
                    this.name = null;
                    this.point_1 = null
                    this.point_2 = null
                    this.point_3 = null
                    this.point_4 = null
                    this.point_5 = null
                }
            }

})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
                <div class="card" v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            task.completed = true
            ColumnCard.status += 1
            let count = 0
            if ((ColumnCard.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
            }
        }
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_two">
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            task.completed = true
            ColumnCard.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                    count++
                }
             if (( ColumnCard.status / count) * 100 >= 100 ) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()

            
            }
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
                <div class="card" v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                        <p>{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})



let app = new Vue({
    el: '#app',
})
