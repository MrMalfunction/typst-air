<template>
  <draggable
    v-model="editableSectionSeq"
    item-key="value"
    @end="onDragEnd"
    tag="div"
    class="column q-gutter-xs"
  >
    <template #item="{ element }">
      <q-chip outline color="primary" icon="drag_indicator" class="cursor-move q-ma-none">
        {{ formatSectionName(element) }}
      </q-chip>
    </template>
  </draggable>
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
