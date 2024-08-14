<template>
    <div>
      <RemoteTable title="Gado Encontrado" route="consulta-publica" :params="params" :columns="columns" onRowClickRoute="gadoInfo" />
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import RemoteTable from 'src/components/RemoteTable.vue'
import moment from 'moment'

const route = useRoute()

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'nome',
    label: 'Nome',
    field: 'nome',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'serie',
    label: 'Série',
    field: 'serie',
    align: 'left',
    sortable: true,
    format: (val, row) => val || '-'
  },
  {
    name: 'rgn',
    label: 'RGN',
    field: 'rgn',
    align: 'left',
    sortable: true,
    format: (val, row) => val || '-'
  },
  {
    name: 'rgd',
    label: 'RGD',
    field: 'rgd',
    align: 'left',
    sortable: true,
    format: (val, row) => val || '-'
  },
  {
    name: 'dt_nasc',
    label: 'Data Nascimento',
    field: 'dt_nasc',
    align: 'left',
    sortable: true,
    format: (val, row) => moment(val).format('DD/MM/YYYY')
  },
  {
    name: 'mgte',
    label: 'MGTe',
    field: 'mgte',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'tmgte',
    label: 'TOP',
    field: 'tmgte',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'raca',
    label: 'Raça',
    field: 'raca',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'variedade',
    label: 'Variedade',
    field: 'variedade',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'nf120',
    label: 'NF120',
    field: 'nf120',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'nr120',
    label: 'NR120',
    field: 'nr120',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'nf450',
    label: 'NF450',
    field: 'nf450',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  },
  {
    name: 'nr450',
    label: 'NR450',
    field: 'nr450',
    align: 'left',
    sortable: true,
    format: (val, row) => `${val}`
  }
]

const params = ref({})

onBeforeMount(() => {
  const search = JSON.parse(route.query.search)
  search.select = columns.map(el => el.field).join(',')
  params.value = search
})
</script>
<style lang="scss">

</style>
