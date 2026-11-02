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
    <draggable v-model="skills" class="q-gutter-y-sm" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <div class="row items-start no-wrap skill-row" :data-skill-index="index">
          <q-icon
            class="drag-handle cursor-move skill-row__tool"
            color="grey-6"
            name="drag_indicator"
            size="20px"
          >
            <q-tooltip>Drag to reorder</q-tooltip>
          </q-icon>
          <div class="skill-row__heading">
            <q-input v-model="element.heading" dense label="Category" outlined />
          </div>
          <div class="col">
            <q-input
              v-model="element.content"
              autogrow
              dense
              label="Skills, comma-separated"
              outlined
            />
          </div>
          <q-btn
            class="skill-row__tool"
            color="grey-7"
            dense
            flat
            icon="delete_outline"
            round
            size="sm"
            @click="removeSkill(index)"
          >
            <q-tooltip>Delete category</q-tooltip>
          </q-btn>
        </div>
      </template>
    </draggable>
    <q-btn
      class="q-mt-sm"
      color="primary"
      dense
      flat
      icon="add"
      label="Add skill category"
      no-caps
      @click="addSkill"
    />
  </div>
</template>

<style scoped>
.skill-row {
  gap: 6px;
}

.skill-row__heading {
  width: 32%;
  min-width: 120px;
}

.skill-row__tool {
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.15s;
}

.skill-row:hover .skill-row__tool,
.skill-row:focus-within .skill-row__tool {
  opacity: 1;
}
</style>
