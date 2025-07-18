<template>
  <v-container fluid class="chat-layout pa-0">
    <v-row no-gutters>
      <!-- Левая панель -->
      <v-col cols="12" md="3" class="chat-sidebar pa-4" style="height: 100vh; overflow-y: auto;">

        <v-card-title class="text-h5 font-weight-bold mb-0">
          Юридический AI-сервис
        </v-card-title>
        <h3 class="text-h6 mb-0 ml-4">
          Мои запросы
        </h3>
        <v-list dense nav>
          <v-list-item v-for="(item, index) in history" :key="item.id" @click="selectResult(item)"
            :class="{ 'bg-blue-grey-lighten-4': selected?.id === item.id }">
            <v-list-item-content>
              <v-list-item-title class="text-truncate">
                📄 {{ item.title || `Обработка ${index + 1}` }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Правая область -->
      <v-col cols="12" md="9" class="d-flex flex-column chat-main">
        <v-card-title class="text-h5 font-weight-bold">
          Форма запроса
        </v-card-title>
        <v-card flat class="flex-grow-1 pa-4 overflow-auto result-area">
          <div v-if="!selected" class="instruction-text pa-4">
            <template v-if="isProcessing">
              Запрос обрабатывается...
            </template>
            <template v-else>
              Пожалуйста, введите ваш запрос в форму ниже, чтобы получить юридический ответ.
            </template>
          </div>
          <ResultCard v-if="selected" :result="selected" class="mb-4" />
        </v-card>

        <!-- Кнопка Новый запрос -->
        <v-btn v-if="selected" color="primary" class="mt-2 mb-4 ml-4" @click="resetForm">
          {{ selected.success ? '🔄 Новый запрос' : '🔁 Повторить запрос' }}
        </v-btn>

      
        <v-card flat class="form-section px-4 pt-2 pb-4 border-top blue-back" ref="formRef">
          <v-form>
            <v-textarea v-model="query" label="Введите запрос" placeholder="Что вас интересует?" auto-grow rows="2"
              class="mb-2" />
            <v-text-field v-model="prompt" label="Промт" placeholder="Формат или стиль ответа" class="mb-2" />
            <v-text-field v-model="context" label="Контекст" placeholder="Дополнительные детали" class="mb-4" />

            <!-- Кнопки -->
            <div class="d-flex flex-wrap gap-4 mb-4">
              <v-btn color="primary" @click="startProcessing" :disabled="isProcessing" class="px-6 mr-4">
                Обработать запрос
              </v-btn>

              <v-btn :to="{ name: 'history' }" router>
                История запросов
              </v-btn>
            </div>

            <v-progress-linear v-if="isProcessing" indeterminate color="primary" class="mt-2" />
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ResultCard from '../components/ResultCard.vue'
const history = ref(loadHistory())


const formRef = ref<HTMLElement | null>(null)

function resetForm() {
  query.value = ''
  prompt.value = ''
  context.value = ''
  result.value = null
  selected.value = null

  nextTick(() => {
    formRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

interface DocumentInfo {
  title: string
  section: string
}

interface Result {
  id: string
  title: string
  success: boolean
  duration: string
  response: string
  documents: DocumentInfo[]
}


function selectResult(item: Result) {
  selected.value = item
}


const query = ref('')
const prompt = ref('')
const context = ref('')
const isProcessing = ref(false)
const result = ref<Result | null>(null)
const selected = ref<Result | null>(null)

// Для хранения истории в localStorage
const HISTORY_KEY = 'processing_history'

function loadHistory(): Result[] {
  const json = localStorage.getItem(HISTORY_KEY)
  return json ? JSON.parse(json) : []
}

function saveHistory(history: Result[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}


async function startProcessing() {
  isProcessing.value = true
  result.value = null

  const startTime = new Date()

  await new Promise((r) => setTimeout(r, 3000))

  const endTime = new Date()
  const duration = new Date(endTime.getTime() - startTime.getTime())
    .toISOString()
    .substring(11, 19)

  const title = query.value
    .split(' ')
    .filter(w => w.length > 3) 
    .slice(0, 4) 
    .join(' ')
    .trim()

  const isSuccess = Math.random() < 0.7

  const variants: Result[] = isSuccess
  ? [{
    id: Date.now().toString(),
    success: true,
    duration,
    response: 'Договор аренды может быть расторгнут досрочно по соглашению сторон или при существенном нарушении условий. Рекомендуется оформить расторжение письменно.',
    documents: [
      { title: 'Гражданский кодекс', section: 'Статья 450' },
      { title: 'Гражданский кодекс', section: 'Статья 619' },
    ],
    title: title || `Обработка от ${new Date().toLocaleDateString()}`,
  },
  {
    id: Date.now().toString(),
    success: true,
    duration,
    response: 'Для взыскания долга необходимо направить претензию должнику. При отсутствии реакции — подать иск в суд. Рекомендуется приложить договор, переписку и подтверждение долга.',
    documents: [
      { title: 'Гражданский процессуальный кодекс', section: 'Статья 131' },
      { title: 'Гражданский кодекс', section: 'Статья 309' },
    ],
    title: title || `Обработка от ${new Date().toLocaleDateString()}`,
  },
  {
    id: Date.now().toString(),
    success: true,
    duration,
    response: 'Работник имеет право уволиться по собственному желанию, уведомив работодателя за 14 дней. Заявление оформляется в письменной форме.',
    documents: [
      { title: 'Трудовой кодекс РФ', section: 'Статья 80' },
      { title: 'Трудовой кодекс РФ', section: 'Статья 84.1' },
    ],
    title: title || `Обработка от ${new Date().toLocaleDateString()}`,
  }
  ]: [{
      id: Date.now().toString(),
      success: false,
      duration,
      response: 'Произошла ошибка обработки запроса. Пожалуйста, попробуйте снова.',
      documents: [],
      title: title || `Обработка от ${new Date().toLocaleDateString()}`,
    }]
  const newResult = variants[Math.floor(Math.random() * variants.length)]
  newResult.duration = duration




  result.value = newResult
  selected.value = newResult

  // Сохраняем в историю
  history.value.unshift(newResult)
  saveHistory(history.value)


  isProcessing.value = false
}
</script>