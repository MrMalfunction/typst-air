<script setup>
// Collapsible card for one resume entry (job, project, school).
// Header shows a one-line summary; the body holds the entry's fields.
const expanded = defineModel('expanded', { type: Boolean, default: false })

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  placeholder: { type: String, default: 'Untitled entry' },
})

const emit = defineEmits(['delete'])
</script>

<template>
  <q-card bordered flat class="entry-card" :class="{ 'entry-card--open': expanded }">
    <div class="row items-center no-wrap entry-card__header">
      <q-icon class="drag-handle cursor-move q-mr-xs" color="grey-6" name="drag_indicator" size="20px">
        <q-tooltip>Drag to reorder</q-tooltip>
      </q-icon>

      <div class="col entry-card__summary cursor-pointer" @click="expanded = !expanded">
        <div class="text-body2 text-weight-medium ellipsis">{{ title || placeholder }}</div>
        <div v-if="subtitle" class="text-caption text-grey-7 ellipsis">{{ subtitle }}</div>
      </div>

      <slot name="actions" />
      <q-btn color="grey-7" dense flat icon="delete_outline" round size="sm" @click="emit('delete')">
        <q-tooltip>Delete entry</q-tooltip>
      </q-btn>
      <q-btn
        :icon="expanded ? 'expand_less' : 'expand_more'"
        color="grey-7"
        dense
        flat
        round
        size="sm"
        @click="expanded = !expanded"
      />
    </div>

    <q-slide-transition>
      <div v-show="expanded" class="entry-card__body">
        <slot />
      </div>
    </q-slide-transition>
  </q-card>
</template>

<style scoped>
.entry-card__header {
  padding: 6px 8px 6px 6px;
  gap: 4px;
}

.entry-card__summary {
  min-width: 0;
  padding: 2px 4px;
}

.entry-card__body {
  padding: 4px 12px 12px;
}
</style>
