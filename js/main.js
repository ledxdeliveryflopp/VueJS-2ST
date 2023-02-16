let eventBus = new Vue()

Vue.component('column', {
    // колонки
    template: `
 <section id="main" class="main-alt">
 
        <div class="columns">
            <newCard></newCard>
        <p class="error" v-for="error in errors">{{ error }}</p>
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
<!--                <column_3 :column_3="column_3"></column_3>-->
            </div>
 </section>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            // column_3: [],
            errors: [],
        }
    },
    mounted() {
        // создание заметки
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
    }
})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
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
            date: null,
            errors: [],
        }
    },
    methods: {
        Submit() {
            let card = {
                name: this.name,
                points: [{name: this.point_1,},
                    {name: this.point_2,},
                    {name: this.point_3,}],
                date: this.date,
                // date: null,
                status: 0,
                // errors: [],
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
        }
    }

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
            for(let i = 0; i < 3; i++){
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
        },
    },
})
//
// Vue.component('column_3', {
//     template: `
//         <section id="main" class="main-alt">
//             <div class="column column__three">
//                 <div class="card" v-for="card in column_3"><p>{{ card.name }}</p>
//                     <div class="tasks" v-for="task in card.points"
//                         v-if="task.name != null"
//                         @click="changeCompleted(card, task)"
//                         :class="{completed: task.completed}">
//                         {{ task.name }}
//                     </div>
//                         <p>{{ card.date }}</p>
//                 </div>
//             </div>
//         </section>
//     `,
// })

let app = new Vue({
    el: '#app',
})
