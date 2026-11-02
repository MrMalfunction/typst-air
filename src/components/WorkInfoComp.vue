<script setup>
import draggable from 'vuedraggable'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { storeToRefs } from 'pinia'
import { handleEditorPaste } from 'src/util/paste_format_handler.js'
import { generateId } from 'src/util/id-generator.js'

const workInfoStore = useWorkInfoStore()
const { work } = storeToRefs(workInfoStore)

const createDefaultWorkEntry = () => ({
  id: Date.now(),
  title: 'Position Title',
  company: 'Company Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  points: [
    { id: generateId(), value: 'Key achievement or responsibility 1' },
    { id: generateId(), value: 'Key achievement or responsibility 2' },
  ],
})

const addWork = () => {
  work.value.push(createDefaultWorkEntry())
}

const removeWork = (index) => {
  if (work.value.length > 1) {
    work.value.splice(index, 1)
  } else {
    work.value[0] = createDefaultWorkEntry()
  }
}

const addWorkBulletPoint = (workIndex) => {
  const newPointNumber = work.value[workIndex].points.length + 1
  work.value[workIndex].points.push({
    id: generateId(),
    value: `Key achievement or responsibility ${newPointNumber}`,
  })
}

const removeWorkBulletPoint = (workIndex, pointIndex) => {
  const points = work.value[workIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    points[0] = { id: generateId(), value: 'Key achievement or responsibility 1' }
  }
}
</script>

<template>
  <!-- Work Experience Section -->
  <div class="col-12">
    <div class="text-h6">Work Experience</div>
    <draggable v-model="work" class="q-gutter-y-md" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <q-card class="q-pa-md" :data-work-index="index">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="element.title" label="Position Title" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.company" label="Company" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.location" label="Location" outlined required />
            </div>
            <div class="col-6">
              <q-input v-model="element.startDate" label="Start Date" outlined required />
            </div>
            <div class="col-6">
              <q-input v-model="element.endDate" label="End Date" outlined required />
            </div>
            <div class="col-12">
              <draggable
                v-model="element.points"
                group="points"
                handle=".point-drag-handle"
                item-key="id"
              >
                <template #item="{ element: point, index: pointIndex }">
                  <div class="row q-col-gutter-sm items-center q-mb-sm">
                    <div class="col-auto">
                      <q-icon
                        class="point-drag-handle cursor-move"
                        color="grey"
                        name="drag_indicator"
                        size="sm"
                      />
                    </div>
                    <div class="col">
                      <q-editor
                        v-model="point.value"
                        :fonts="{ arial: 'Arial' }"
                        :toolbar="[['bold'], ['link'], ['undo', 'redo']]"
                        content-class="editor-content"
                        min-height="5rem"
                        @paste="handleEditorPaste"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn
                        color="negative"
                        flat
                        icon="remove"
                        round
                        @click="removeWorkBulletPoint(index, pointIndex)"
                      />
                    </div>
                  </div>
                </template>
              </draggable>
              <q-btn
                class="q-mt-sm"
                color="primary"
                flat
                icon="add"
                label="Add Bullet Point"
                @click="addWorkBulletPoint(index)"
              />
            </div>
          </div>
          <div class="col-12 row items-center">
            <q-btn class="drag-handle" flat icon="drag_indicator" round>
              <q-tooltip hove>Drag and rearrange order</q-tooltip>
            </q-btn>
            <q-btn
              class="q-ml-auto"
              color="negative"
              flat
              icon="delete"
              round
              @click="removeWork(index)"
            >
              <q-tooltip>Delete Entry</q-tooltip>
            </q-btn>
          </div>
        </q-card>
      </template>
    </draggable>
    <q-btn
      class="q-mt-md"
      color="primary"
      icon="add"
      label="Add Work Experience"
      @click="addWork"
    />
  </div>
</template>
