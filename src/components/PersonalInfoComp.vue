<script setup>
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { storeToRefs } from 'pinia'

const personalInfoStore = usePersonalInfoStore()

const { name, location, email, phone, github, linkedin, personalSite } =
  storeToRefs(personalInfoStore)
</script>

<template>
  <div class="col-12">
    <q-input v-model="name" dense label="Name" outlined />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="location" dense label="Location" outlined />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="email" dense label="Email" outlined type="email" />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="phone" dense label="Phone" outlined />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="linkedin" dense label="LinkedIn" outlined />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="github" dense label="GitHub" outlined placeholder="Optional" />
  </div>
  <div class="col-12 col-sm-6">
    <q-input v-model="personalSite" dense label="Website" outlined placeholder="Optional" />
  </div>
</template>

<style scoped></style>
