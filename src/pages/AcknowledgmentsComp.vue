<template>
  <q-layout>
    <q-header class="bg-primary text-white q-pa-md" elevated>
      <q-toolbar>
        <q-toolbar-title> AI Resume </q-toolbar-title>
        <q-btn flat label="Back to Resume Builder" to="/" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="container q-mx-auto q-mt-lg">
          <h1 class="text-h4 q-mb-md">Third-Party Software Acknowledgments</h1>
          <p class="text-body1">
            This software includes the following third-party open source software components:
          </p>

          <div class="q-mb-lg icon-attribution">
            <a
              href="https://www.flaticon.com/free-icons/artificial-intelligence"
              title="artificial intelligence icons"
              >Artificial intelligence icons created by Smashicons - Flaticon</a
            >
          </div>
          <div class="q-mb-lg icon-attribution">
            <a
              href="https://github.com/stuxf/basic-typst-resume-template?tab=Unlicense-1-ov-file"
              title="resume format"
              >Resume Format [Derived From]</a
            >
          </div>

          <div class="row q-col-gutter-md">
            <div
              v-for="(pkg, name) in filteredPackages"
              :key="name"
              class="col-12 col-md-6 col-lg-4"
            >
              <q-card class="package-card full-height">
                <q-card-section>
                  <div class="text-h6">{{ name }}</div>
                  <div class="text-subtitle2">License: {{ pkg.licenses }}</div>
                  <div v-if="pkg.repository" class="text-caption repository-link">
                    Repository: <a :href="pkg.repository" target="_blank">{{ pkg.repository }}</a>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="q-mt-xl text-center">
            <q-btn
              color="primary"
              icon="arrow_back"
              label="Back to Resume Builder"
              no-caps
              to="/"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import licenses from 'assets/licenses.json'
import { computed } from 'vue'

// Filter packages to only include those with parent as "UNDEFINED"
const filteredPackages = computed(() => {
  const result = {}
  for (const [name, pkg] of Object.entries(licenses)) {
    if (pkg.parents === 'UNDEFINED') {
      result[name] = pkg
    }
  }
  return result
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.package-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.package-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.full-height {
  height: 100%;
}

.repository-link {
  word-break: break-word;
  overflow-wrap: break-word;
}

.icon-attribution {
  font-style: italic;
  color: rgba(0, 0, 0, 0.7);
}

.icon-attribution a {
  text-decoration: none;
  color: var(--q-primary);
}

.icon-attribution a:hover {
  text-decoration: underline;
}
</style>
