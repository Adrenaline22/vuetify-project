<template>
  <v-card elevation="3" class="pa-4">
    <v-card-title>
      <span v-if="result.success" class="green--text">Успешно</span>
      <span v-else class="red--text">Неуспешно</span>
      <v-spacer />
      <span>{{ result.duration }}</span>
    </v-card-title>
    <v-card-text>
      <p>{{ result.response }}</p>
      <v-list dense>
        <v-subheader>Документы:</v-subheader>
        <v-list-item v-for="(doc, i) in result.documents" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ doc.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ doc.section }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface DocumentInfo {
  title: string
  section: string
}

interface Result {
  success: boolean
  duration: string
  response: string
  documents: DocumentInfo[]
}

const props = defineProps<{ result: Result }>()
</script>
