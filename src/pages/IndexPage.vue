<template>
  <q-layout>
    <HeaderComp />
    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div class="col form-container q-pa-md">
          <!-- Save Resume Controls - moved from header to top of form -->
          <div class="row q-col-gutter-md q-mb-md">
            <SaveComp />
            <StyleOptionsComp />
          </div>

          <div class="text-h6">Personal Information</div>
          <div class="row q-col-gutter-md">
            <PersonalInfoComp />
            <SummaryInfoComp />
            <EduInfoComp />
            <WorkInfoComp />
            <ProjectInfoComp />
            <SkillsInfoComp />
          </div>
        </div>
        <PreviewSVG />
      </q-page>
    </q-page-container>
    <q-footer class="bg-white text-grey-8">
      <q-toolbar class="justify-center">
        <router-link class="text-grey-8 text-decoration-none" to="/acknowledgments">
          Third-Party Acknowledgments
        </router-link>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import HeaderComp from 'components/HeaderComp.vue'
import PersonalInfoComp from 'components/PersonalInfoComp.vue'
import SummaryInfoComp from 'components/SummaryInfoComp.vue'
import EduInfoComp from 'components/EduInfoComp.vue'
import WorkInfoComp from 'components/WorkInfoComp.vue'
import ProjectInfoComp from 'components/ProjectinfoComp.vue'
import SkillsInfoComp from 'components/SkillsInfoComp.vue'
import PreviewSVG from 'components/PreviewSVG.vue'
import SaveComp from 'components/SaveComp.vue'
import StyleOptionsComp from 'components/StyleOptionsComp.vue'
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
