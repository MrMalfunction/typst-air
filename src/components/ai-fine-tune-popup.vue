<script setup>
import { computed, defineEmits, defineProps, onMounted, ref, watch } from 'vue'
import { useJobsStore } from 'src/stores/jobs-store'
import { api } from 'boot/axios.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  section: String,
  stringsArray: Array,
})
const isVisible = ref(true)
const emit = defineEmits(['updateStrings', 'dialogStatus'])

const jobsStore = useJobsStore()
const selectedJob = ref(null)
const showNewJobForm = ref(false)
const isAddingJob = ref(false)
const isSubmitting = ref(false)

watch(isVisible, (newValue) => {
  if (newValue === false) {
    emit('dialogStatus', false)
  }
})

// Simplified new job details
const newJob = ref({
  title: '',
  company: '',
  description: '',
})

const sortedJobs = computed(() => {
  return [...jobsStore.jobs].sort((a, b) => b.dateAdded - a.dateAdded)
})

// Compute the display label for each job
const getJobLabel = (job) => {
  return `${job.company} | ${job.title}`
}

const formattedOptions = computed(() => {
  return sortedJobs.value.map((job) => ({
    value: job.id,
    label: getJobLabel(job),
    job: job, // Store the entire job object
  }))
})

onMounted(() => {
  if (formattedOptions.value.length > 0) {
    selectedJob.value = formattedOptions.value[0]
  }
  // Initialize the company name
  newJob.value.company = props.section
})

const toggleNewJobForm = () => {
  showNewJobForm.value = !showNewJobForm.value

  // Reset and initialize form when opening
  if (showNewJobForm.value) {
    newJob.value.title = ''
    newJob.value.company = props.section
    newJob.value.description = ''
  }
}

const addNewJob = async () => {
  if (!newJob.value.title.trim() || !newJob.value.company.trim()) return

  isAddingJob.value = true

  try {
    // Add the new job to the store
    const createdJob = jobsStore.addJob({
      title: newJob.value.title,
      company: newJob.value.company,
      description: newJob.value.description || 'Added from resume builder',
    })

    // Create the formatted option for the new job
    // Select the new job
    selectedJob.value = {
      value: createdJob.id,
      label: getJobLabel(createdJob),
      job: createdJob,
    }

    // Reset form
    newJob.value = {
      title: '',
      company: props.section,
      description: '',
    }
    showNewJobForm.value = false
  } finally {
    isAddingJob.value = false
  }
}

const handleButtonClick = async () => {
  isSubmitting.value = true
  try {
    // Access the actual job object from selected option
    const jobData = selectedJob.value?.job
    console.log(jobData)
    console.log(props.stringsArray)

    const response = await api.post('/', {
      jobDescription: jobData.description,
      resumePoints: props.stringsArray.join('\n'),
    })

    // Extract the parsed points from the response
    if (response.data && response.data.parsedPoints) {
      emit('updateStrings', response.data.parsedPoints)
      closeDialog()
    } else {
      $q.notify({
        type: 'negative',
        message: 'Response is missing points.',
      })
      console.error('Response is missing parsedPoints:', response.data)
    }
  } catch (error) {
    const errorMessage = error.message || 'An error occurred while processing your request'
    $q.notify({
      type: 'negative',
      message: `${errorMessage}`,
    })
    console.error('Error during axios request:', error)
  } finally {
    isSubmitting.value = false
  }
}

const closeDialog = () => {
  isVisible.value = false
  emit('dialogStatus', false)
}
</script>

<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1"
          >Fine Tuning Current Points of : {{ selectedJob.job.company }}
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <!-- Center aligned q-select -->
        <div class="q-pa-md flex flex-center">
          <q-select
            v-model="selectedJob"
            :options="formattedOptions"
            behavior="menu"
            input-debounce="0"
            label="Select Job"
            option-label="label"
            outlined
            style="width: 350px"
          >
            <template v-slot:after>
              <q-btn color="primary" dense flat icon="add" round @click="toggleNewJobForm">
                <q-tooltip> Add a new job </q-tooltip>
              </q-btn>
            </template>
          </q-select>
        </div>

        <!-- Simplified job form -->
        <div v-if="showNewJobForm" class="q-pa-md">
          <div class="text-h6 q-mb-md">Add a new Job</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-input v-model="newJob.title" dense label="Job Title" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="newJob.company" dense label="Company" outlined required />
            </div>
            <div class="col-12">
              <q-input
                v-model="newJob.description"
                dense
                label="Description"
                outlined
                type="textarea"
              />
            </div>
            <div class="col-12 flex justify-end q-gutter-sm">
              <q-btn
                :disable="isAddingJob"
                color="red"
                label="Cancel"
                outline
                @click="showNewJobForm = false"
              />
              <q-btn
                :disable="
                  !newJob.title.trim() ||
                  !newJob.company.trim() ||
                  !newJob.description.trim() ||
                  isAddingJob
                "
                :loading="isAddingJob"
                color="primary"
                label="Add Job"
                @click="addNewJob"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="red" label="Close" outline @click="closeDialog" />
        <q-btn
          :disable="isAddingJob || showNewJobForm || isSubmitting"
          :loading="isSubmitting"
          color="primary"
          label="Submit"
          @click="handleButtonClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
