<script setup>
import draggable from 'vuedraggable'
import { handleEditorPaste } from 'src/util/paste_format_handler.js'
import { generateId } from 'src/util/id-generator.js'

// Editable, reorderable list of { id, value } bullet points.
const points = defineModel({ type: Array, required: true })

const props = defineProps({
  // Rich text (bold/link) editor vs. plain text input
  rich: { type: Boolean, default: false },
  defaultText: { type: String, default: 'Key achievement or responsibility' },
})

const addPoint = () => {
  points.value.push({ id: generateId(), value: `${props.defaultText} ${points.value.length + 1}` })
}

const removePoint = (pointIndex) => {
  if (points.value.length > 1) {
    points.value.splice(pointIndex, 1)
  } else {
    points.value[0] = { id: generateId(), value: `${props.defaultText} 1` }
  }
}
</script>

<template>
  <div class="bullet-list">
    <draggable v-model="points" group="points" handle=".point-drag-handle" item-key="id">
      <template #item="{ element: point, index: pointIndex }">
        <div class="row items-start no-wrap bullet-row">
          <q-icon
            class="point-drag-handle cursor-move bullet-row__tool"
            color="grey-6"
            name="drag_indicator"
            size="18px"
          />
          <span class="bullet-row__marker text-grey-6">•</span>
          <div class="col">
            <q-editor
              v-if="rich"
              v-model="point.value"
              :toolbar="[['bold', 'link'], ['undo', 'redo']]"
              class="bullet-editor"
              content-class="editor-content"
              dense
              flat
              min-height="1.5rem"
              @paste="handleEditorPaste"
            />
            <q-input v-else v-model="point.value" autogrow borderless dense class="bullet-input" />
          </div>
          <q-btn
            class="bullet-row__tool"
            color="grey-7"
            dense
            flat
            icon="close"
            round
            size="xs"
            @click="removePoint(pointIndex)"
          >
            <q-tooltip>Remove bullet</q-tooltip>
          </q-btn>
        </div>
      </template>
    </draggable>
    <q-btn
      class="q-mt-xs"
      color="primary"
      dense
      flat
      icon="add"
      label="Bullet"
      no-caps
      size="sm"
      @click="addPoint"
    />
  </div>
</template>

<style scoped>
.bullet-row {
  gap: 4px;
  padding: 2px 0;
}

.bullet-row__marker {
  margin-top: 6px;
  line-height: 1.5rem;
}

.bullet-row__tool {
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}

.bullet-row:hover .bullet-row__tool,
.bullet-row:focus-within .bullet-row__tool {
  opacity: 1;
}

.bullet-editor,
.bullet-input {
  border: 1px solid transparent;
  border-radius: 4px;
  transition: border-color 0.15s;
}

.bullet-input {
  padding: 0 8px;
}

.bullet-row:hover .bullet-editor,
.bullet-row:hover .bullet-input,
.bullet-row:focus-within .bullet-editor,
.bullet-row:focus-within .bullet-input {
  border-color: rgba(128, 128, 128, 0.35);
}

/* Formatting toolbar only while editing */
.bullet-editor :deep(.q-editor__toolbars-container) {
  display: none;
}

.bullet-editor:focus-within :deep(.q-editor__toolbars-container) {
  display: block;
}

.bullet-editor :deep(.q-editor__content) {
  padding: 6px 8px;
}
</style>
