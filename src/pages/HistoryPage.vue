<template>
  <v-container>
    <v-card-title class="text-h5">История обработок</v-card-title>

    <v-btn class="mb-4" color="primary" :to="{ name: 'home' }" router>
      Новый запрос
    </v-btn>

    <v-card>
      <v-card-text>
        <v-list>
          <v-list-group
            v-for="(group, date) in groupedHistory"
            :key="date"
            value="true"
            class="mb-2"
            prepend-icon="mdi-calendar"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props" class="border-b">
                <v-list-item-title>
                  {{ date }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <!-- Список обработок за дату -->
           <template v-for="(item, idx) in group" :key="item.id">
  <v-list-item
    class="border-b"
    @click="toggle(item)"
  >
    <v-list-item-content>
      <v-list-item-title>
        📄 {{ item.title || `Обработка №${idx + 1}` }}
      </v-list-item-title>
      <v-list-item-subtitle>
        Длительность: {{ item.duration }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-icon>
      <v-icon>{{ isOpen(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-list-item-icon>
  </v-list-item>

  <ResultCard
    v-if="isOpen(item)"
    :result="item"
    class="mx-4 my-2"
  />
</template>

          </v-list-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ResultCard from '../components/ResultCard.vue'

interface DocumentInfo {
  title: string
  section: string
}


function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

interface Result {
  id: string
  title: string
  success: boolean
  duration: string
  response: string
  documents: DocumentInfo[]
  date?: string
}

const HISTORY_KEY = 'processing_history'

const history = ref<Result[]>([])
const openItems = ref<Set<string>>(new Set()) 

function loadHistory(): Result[] {
  const json = localStorage.getItem(HISTORY_KEY)
  if (!json) return []
  const list = JSON.parse(json) as Result[]
  return list.map(r => ({
    ...r,
    date: new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
  }))
}

onMounted(() => {
  history.value = loadHistory()
})

const groupedHistory = computed(() => {
  const groups: Record<string, Result[]> = {}
  for (const item of history.value) {
    const date = item.date || 'Неизвестная дата'
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  }
  return groups
})



function toggle(item: Result) {
  const key = item.id
  if (openItems.value.has(key)) {
    openItems.value.delete(key)
  } else {
    openItems.value.add(key)
  }
}

function isOpen(item: Result) {
  return openItems.value.has(item.id)
}

</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #eee;
}
</style>
