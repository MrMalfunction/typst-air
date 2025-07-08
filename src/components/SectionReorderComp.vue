<template>
  <q-card class="q-mb-md">
    <q-card-section class="q-pb-sm">
      <div class="text-h6">Reorder Sections</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <draggable
        v-model="editableSectionSeq"
        item-key="value"
        @end="onDragEnd"
        tag="div"
        class="q-gutter-sm row"
      >
        <template #item="{ element }">
          <q-chip color="primary" text-color="white" icon="drag_indicator" class="cursor-pointer">
            {{ formatSectionName(element) }}
          </q-chip>
        </template>
      </draggable>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useSectionSeqStore } from 'stores/section-seq-store'
import { storeToRefs } from 'pinia'

const sectionSeqStore = useSectionSeqStore()
const { sectionSeq } = storeToRefs(sectionSeqStore)

const editableSectionSeq = ref([...sectionSeq.value])

const allSections = [
  { label: 'Education', value: 'edu' },
  { label: 'Work Experience', value: 'work' },
  { label: 'Projects', value: 'projects' },
  { label: 'Skills', value: 'skills' },
]

watch(sectionSeq, (newVal) => {
  editableSectionSeq.value = [...newVal]
})

const formatSectionName = (name) => {
  const section = allSections.find((s) => s.value === name)
  return section ? section.label : name
}

const onDragEnd = () => {
  sectionSeqStore.$patch({ sectionSeq: editableSectionSeq.value })
}
</script>

<style scoped>
/* Add any specific styles for your reorder component here */
</style>
