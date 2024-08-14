<template>
    <q-select
        v-model="selected"
        :options="options"
        use-input
        hide-dropdown-icon
        filled
        @filter="filterFn"
        :label="props.label"
        input-debounce="300"
        clearable
        @update:model-value="emitSelected"
    />
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'

const selected = ref(null)
const options = ref([])

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
  }
})

const filterFn = async (val, update) => {
  if (val === '') {
    options.value = []
    return
  }

  try {
    const response = await api.get('consulta-publica/search-gado-by', {
      params: {
        field: props.labelField,
        query: val
      }
    })

    options.value = response.data.map(el => ({
      label: el[props.labelField],
      value: el[props.valueField]
    }))
  } catch (error) {
    console.error(error)
    options.value = []
  }

  update()
}

const emitSelected = (value) => {
  emit('selected', value)
}
</script>
