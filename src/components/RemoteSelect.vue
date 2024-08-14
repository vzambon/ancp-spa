<template>
    <q-select
        v-model="selected"
        :options="options"
        filled
        :label="props.label"
        input-debounce="300"
        clearable
        @update:model-value="emitSelected"
        :filterFn="filterFn"
        :rules="[(val) => props.required ? !!val | 'Campo Orbrigatório': null]"
        :loading="loading"
    />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { api } from 'src/boot/axios'

const selected = ref(null)
const options = ref([])
const loading = ref(true)

const emit = defineEmits(['selected'])

const props = defineProps({
  label: {
    type: String,
    default: 'Search'
  },
  valueField: {
    type: String,
    default: 'id'
  },
  labelField: {
    type: String,
    default: 'nome'
  },
  route: {
    type: String,
    required: true
  },
  plainArray: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

function fetchData () {
  api.get(props.route)
    .then(response => {
      options.value = response.data.map((el) => {
        if (props.plainArray) {
          return el
        } else {
          return {
            value: el[props.valueField],
            label: el[props.labelField]
          }
        }
      })
    })
    .catch(error => {
      console.error(error)
      options.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

onBeforeMount(() => {
  fetchData()
})

const emitSelected = (value) => {
  emit('selected', value)
}
</script>
