<template>
    <div class="page-box">
      <h2 class="page-title">{{ title }}</h2>
      <div>
        <slot name="content">
          <div class="q-pa-md">
            <q-table
              :rows="rows"
              :columns="columns"
              row-key="name"
              flat
              bordered
              v-model:pagination.sync="pagination"
              :loading="loading"
              @request="fetchData($event)"
              @row-click="onRowClick"
            />
          </div>
        </slot>
      </div>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const rows = ref([])

const loading = ref(false)

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  route: {
    type: String,
    default: '',
    required: true
  },
  columns: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: () => ({})
  },
  onRowClickRoute: {
    type: String,
    default: ''
  }
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: props.columns[0]?.name ?? null,
  descending: false,
  rowsNumber: 0
})

const fetchData = (val) => {
  loading.value = true
  rows.value = []

  api.get(props.route, { params: { ...props.params, pagination: val?.pagination ?? pagination.value } })
    .then((response) => {
      rows.value = response.data.data
      pagination.value.rowsNumber = response.data.total
      pagination.value.page = response.data.current_page
      pagination.value.rowsPerPage = response.data.per_page
      pagination.value.sortBy = response.data.sortBy
      pagination.value.descending = response.data.descending
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

function onRowClick (evt, row) {
  router.push({ name: props.onRowClickRoute, params: { id: row.id } })
}

onMounted(() => {
  fetchData()
})
</script>
  <style lang="scss">
  .page-box {
    padding: 10px;
  }

  .page-title {
    margin-left: 45px;
  }

  .q-table tr {
    cursor: pointer;
  }
  </style>
