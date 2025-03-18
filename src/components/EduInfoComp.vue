<script setup>
import { storeToRefs } from 'pinia'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import draggable from 'vuedraggable'

const eduInfoStore = useEducationInfoStore()
const { education } = storeToRefs(eduInfoStore)

// Default education entry template
const createDefaultEducationEntry = () => ({
  id: Date.now(),
  institution: 'Institution Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  degree: 'Degree Name',
  points: ['Achievement or responsibility 1', 'Achievement or responsibility 2'],
})

const addEducation = () => {
  education.value.push(createDefaultEducationEntry())
}

const removeEducation = (index) => {
  if (education.value.length > 1) {
    education.value.splice(index, 1)
  } else {
    // If it's the last education entry, reset it to default values instead of removing
    education.value[0] = createDefaultEducationEntry()
  }
}

const addBulletPoint = (educationIndex) => {
  const newPointNumber = education.value[educationIndex].points.length + 1
  education.value[educationIndex].points.push(`Achievement or responsibility ${newPointNumber}`)
}

const removeBulletPoint = (educationIndex, pointIndex) => {
  const points = education.value[educationIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    // If it's the last bullet point, reset it to default value instead of removing
    points[0] = 'Achievement or responsibility 1'
  }
}
</script>

<template>
  <!-- Education Section -->
  <div class="col-12">
    <div class="text-h6">Education</div>
    <draggable
      v-model="eduInfoStore.education"
      class="q-gutter-y-md"
      handle=".drag-handle"
      item-key="id"
    >
      <template #item="{ element, index }">
        <q-card class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="element.institution" label="Institution" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.degree" label="Degree" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.location" label="Location" outlined required />
            </div>
            <div class="col-6">
              <q-input v-model="element.startDate" label="Start Date (Optional)" outlined />
            </div>
            <div class="col-6">
              <q-input v-model="element.endDate" label="End Date" outlined required />
            </div>
            <div class="col-12">
              <div v-for="(_, pointIndex) in element.points" :key="pointIndex">
                <div class="row q-col-gutter-sm items-center">
                  <div class="col">
                    <q-input
                      v-model="element.points[pointIndex]"
                      autogrow
                      label="Bullet Point"
                      outlined
                      required
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="negative"
                      flat
                      icon="remove"
                      round
                      @click="removeBulletPoint(index, pointIndex)"
                    />
                  </div>
                </div>
              </div>
              <q-btn
                class="q-mt-sm"
                color="primary"
                flat
                icon="add"
                label="Add Bullet Point"
                @click="addBulletPoint(index)"
              />
            </div>
          </div>
          <div class="col-12 row items-center">
            <q-btn class="drag-handle" flat icon="drag_indicator" round >
              <q-tooltip hove>Drag and rearrange order</q-tooltip>
            </q-btn>
            <q-btn
              class="q-ml-auto"
              color="negative"
              flat
              icon="delete"
              round
              @click="removeEducation(index)"
            >
              <q-tooltip>Delete Entry</q-tooltip>
            </q-btn>
          </div>
        </q-card>
      </template>
    </draggable>
    <q-btn class="q-mt-md" color="primary" icon="add" label="Add Education" @click="addEducation" />
  </div>
</template>

<style scoped></style>
