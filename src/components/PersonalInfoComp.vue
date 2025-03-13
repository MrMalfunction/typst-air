<script lang="ts" setup>
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { storeToRefs } from 'pinia'

const personalInfoStore = usePersonalInfoStore()

const { name, location, email, phone, github, linkedin, personalSite } =
  storeToRefs(personalInfoStore)
</script>

<template>
  <div class="col-12">
    <q-input v-model="name" label="Name" outlined required />
  </div>
  <div class="col-12">
    <q-input v-model="location" label="Location" outlined required />
  </div>
  <div class="col-12">
    <q-input v-model="email" label="Email" outlined required type="email" />
  </div>
  <div class="col-12">
    <q-input v-model="phone" label="Phone" outlined required />
  </div>
  <div class="col-12">
    <q-input v-model="github" label="GitHub (optional)" outlined />
  </div>
  <div class="col-12">
    <q-input v-model="linkedin" label="LinkedIn" outlined required />
  </div>
  <div class="col-12">
    <q-input v-model="personalSite" label="Personal Website (optional)" outlined />
  </div>
</template>

<style scoped></style>
