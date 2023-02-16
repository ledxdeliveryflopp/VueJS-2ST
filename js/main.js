let eventBus = new Vue()

Vue.component('cols', {
    template: `
 <section id="main" class="main-alt">
        <div class="columns">
            <newCard></newCard>
        <p class="error" v-for="error in errors">{{ error }}</p>
<!--            <div class="column column__one">-->
<!--                <div class="card" v-for="card in column_1"><p>{{ card.name }}</p>-->
<!--                    <div class="tasks" v-for="idk in card.points" v-if="idk.name != null">-->
<!--                         <input @click="newStatus_1(card, idk)"-->
<!--                            class="checkbox" type="checkbox"-->
<!--                            :disabled="idk.completed">-->
<!--                        <p :class="{completed: idk.completed}">{{ idk.name }}</p>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column column__two">-->
<!--                <div class="card" v-for="card in column_2"><p>{{ card.name }}</p>-->
<!--                    <div class="tasks" v-for="idk in card.points" v-if="idk.name != null">-->
<!--                         <input @click="newStatus_2(card, idk)"-->
<!--                            class="checkbox" type="checkbox"-->
<!--                            :disabled="idk.completed">-->
<!--                        <p :class="{completed: idk.completed}">{{ idk.name }}</p>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column column__three">-->
<!--                <div class="card" v-for="card in column_3"><p>{{ card.name }}</p><p>{{ card.date }}</p>-->
<!--                    <div class="tasks" v-for="idk in card.points" v-if="idk.name != null">-->
<!--                        <input @click="idk.completed = true"-->
<!--                            class="checkbox" type="checkbox"-->
<!--                            :disabled="idk.completed">-->
<!--                        <p :class="{completed: idk.completed}">{{ idk.name }}</p>-->
<!--                    </div>                     -->
<!--                </div>-->
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
            </div>
 </section>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            errors: [],
        }
    },
    methods: {
    },
    mounted() {
        eventBus.$on('addColumn_1', card => {
            this.errors = []
            if (this.column_1.length < 3){
                this.column_1.push(card)
            } else {
                this.errors.push('В первой колонке должно быть не более трех карточек.')
            }
        })
        eventBus.$on('addColumn_2', card => {
            this.errors = []
            if (this.column_2.length < 5) {
                this.column_2.push(card)
                this.column_1.splice(this.column_1.indexOf(card), 1)
            } else {
                this.errors.push("Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.")
            }
        })
        eventBus.$on('addColumn_3', card => {
            this.column_3.push(card)
            this.column_2.splice(this.column_2.indexOf(card), 1)
        })
        eventBus.$on('addColumn1-3', card => {
            this.column_3.push(card)
            this.column_1.splice(this.column_1.indexOf(card), 1)
        })
    },
})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__one">
                <div class="card" v-for="card in column_1"><p>{{ card.name }}</p>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
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
        }
    },
    methods: {
        changeCompleted(card, task) {
            task.completed = true
            card.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                if (card.points[i].name != null) {
                    count++
                }
            }
            if ((card.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', card)
            }
            if ((card.status / count) * 100 === 100) {
                card.date = new Date().toLocaleString()
                eventBus.$emit('addColumn1-3', card)
            }
        },
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__two">
                <div class="card" v-for="card in column_2"><p>{{ card.name }}</p>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
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
        }
    },
    methods: {
        changeCompleted(card, task) {
            task.completed = true
            card.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                if (card.points[i].name != null) {
                    count++
                }
            }
            if ((card.status / count) * 100 === 100) {
                eventBus.$emit('addColumn_3', card)
                card.date = new Date().toLocaleString();
            }
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__three">
                <div class="card" v-for="card in column_3"><p>{{ card.name }}</p>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
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
    }
})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
        <form class="row" @submit.prevent="onSubmit">
            <p class="main__text">Заметки</p>
                <div class="form__control">
            <div class="form__name">
                <input required type="text" id="name" placeholder="Введите название заметки"/>
            </div>
                <input required type="text" id="point point__1" v-model="point_1" placeholder="Первый пункт"/>

                <input required type="text" id="point point__2" v-model="point_2" placeholder="Второй пункт"/>

                <input required type="text" id="point point__3" v-model="point_3" placeholder="Третий пункт"/> 
 
            </div>
                <div class="form__control">
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
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            let card = {
                name: this.name,
                points: [{name: this.point_1, completed: false},
                            {name: this.point_2, completed: false},
                            {name: this.point_3, completed: false}],
                date: null,
                status: 0,
                errors: [],
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
        }
    }
})

let app = new Vue({
    el: '#app',
})
