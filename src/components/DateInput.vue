<template>
  <div>
    <q-input
    :class="customClass"
    input-style="cursor:pointer"
    filled
    v-model="date"
    :readonly="readonly"
    :label="label"
    :rules="rules"
    @click="openDatePicker"
    :disable="disable"
    hide-bottom-space
    clearable
  >
    <template v-slot:append>
      <div v-if="date !== null && !disable">
        <q-icon name="cancel" @click.self="clearDate" class="cursor-pointer"></q-icon>
      </div>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date v-model="pickedDate" mask="YYYY-MM-DD" :options="optionsFn">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, toRefs } from 'vue'
import moment from 'moment'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => ['required']
  },
  from: {
    type: String,
    default: null
  },
  until: {
    type: String,
    default: null
  },
  noFilter: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const { modelValue } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const pickedDate = ref(null)
const date = ref(null)
const qDateProxy = ref(null)

const openDatePicker = () => {
  qDateProxy.value.show()
}

const clearDate = () => {
  date.value = null
  pickedDate.value = null
  emit('update:modelValue', null)
}

const optionsFn = (d) => {
  if (props.noFilter || (props.from == null && props.until == null)) {
    return true
  }

  const date = moment(d, 'YYYY-MM-DD')

  if (props.from && props.until) {
    return date.isBetween(moment(props.from), moment(props.until), null, '[]')
  } else if (props.from && !props.until) {
    const delimiter = moment(props.from)
    return date.isSame(delimiter, 'day') || date.isAfter(delimiter, 'day')
  } else if (!props.from && props.until) {
    return date.isSameOrBefore(moment(props.until), 'day')
  }

  return true
}

watch(modelValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    date.value = newValue
    pickedDate.value = newValue
  }
})

watch(pickedDate, (val) => {
  if (val) {
    date.value = moment(val).format('DD/MM/YYYY')
  }
  emit('update:modelValue', val)
})

onMounted(() => {
  if (props.modelValue !== '' && props.modelValue !== null) {
    pickedDate.value = props.value
  } else {
    pickedDate.value = null
  }
})
</script>

<style scoped>
</style>
