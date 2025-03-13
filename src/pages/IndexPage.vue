<template>
  <q-layout>
    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div class="col form-container q-pa-md">
          <!-- Save Resume Controls - moved from header to top of form -->
          <div class="row q-col-gutter-md q-mb-md">
            <SaveComp />
          </div>

          <div class="text-h6">Personal Information</div>
          <div class="row q-col-gutter-md">
            <PersonalInfoComp />
            <EduInfoComp />
            <WorkInfoComp />
            <ProjectInfoComp />
            <SkillsInfoComp />
          </div>
        </div>
        <PreviewSVG />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import PersonalInfoComp from 'components/PersonalInfoComp.vue'
import EduInfoComp from 'components/EduInfoComp.vue'
import WorkInfoComp from 'components/WorkInfoComp.vue'
import ProjectInfoComp from 'components/ProjectinfoComp.vue'
import SkillsInfoComp from 'components/SkillsInfoComp.vue'
import PreviewSVG from 'components/PreviewSVG.vue'
import SaveComp from 'components/SaveComp.vue'
// Selected resume name for loading
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-container {
  overflow-y: auto;
}
</style>
