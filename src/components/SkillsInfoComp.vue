<script setup>
import draggable from 'vuedraggable'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { storeToRefs } from 'pinia'

const skillInfoStore = useSkillsInfoStore()
const { skills } = storeToRefs(skillInfoStore)

const createDefaultSkillEntry = () => ({
  id: Date.now(),
  heading: 'New Category',
  content: 'Skill 1, Skill 2, Skill 3',
})

const addSkill = () => {
  skills.value.push(createDefaultSkillEntry())
}

const removeSkill = (index) => {
  if (skills.value.length > 1) {
    skills.value.splice(index, 1)
  } else {
    skills.value[0] = createDefaultSkillEntry()
  }
}
</script>

<template>
  <div class="col-12">
    <div class="text-h6">Skills</div>
    <draggable v-model="skills" class="q-gutter-y-md" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <q-card class="q-pa-md" :data-skill-index="index">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="element.heading" label="Category" outlined required />
            </div>
            <div class="col-12">
              <q-input
                v-model="element.content"
                autogrow
                hint="Enter skills separated by commas"
                label="Skills (comma-separated)"
                outlined
                required
                type="textarea"
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
              @click="removeSkill(index)"
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
      label="Add Skill Category"
      @click="addSkill"
    />
  </div>
</template>

<style scoped></style>
