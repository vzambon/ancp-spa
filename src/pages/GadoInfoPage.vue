<template>
    <div class="q-pa-xl">
      <div>
        <div v-if="!gado" class="spinner-wrapper">
          <q-spinner-hourglass
            color="primary"
            size="3em"
          />
        </div>
        <div id="report" v-else class="q-pa-md">
          <h2>Ficha Animal</h2>

          <q-card flat bordered class="row q-pa-md q-gutter-md">
            <q-input class="col-grow col-3" label="Nome" v-model="gado.nome" filled readonly/>
            <q-input class="col-grow col-3" label="Proprietario" v-model="gado.proprietario" filled readonly/>
            <q-input class="col-grow col-3" label="Criador" v-model="gado.criador" filled readonly/>
          </q-card>

          <q-card flat bordered class="row q-pa-md q-gutter-md q-mt-md">
            <q-input class="col-grow" label="Série" v-model="gado.serie" filled readonly/>
            <q-input class="col-grow" label="RGN" v-model="gado.rgn" filled readonly/>
            <q-input class="col-grow" label="RGD" v-model="gado.rgd" filled readonly/>
            <q-input class="col-grow" label="Raça" v-model="gado.raca" filled readonly/>
            <q-input class="col-grow" label="Categoria" v-model="gado.categoria" filled readonly/>
            <q-input class="col-grow" label="Variedade" v-model="gado.variedade" filled readonly/>
          </q-card>

          <q-card flat bordered class="row q-pa-md q-gutter-md q-mt-md">
            <q-input class="col-grow" label="Sexo" v-model="macho" filled readonly/>
            <q-input class="col-grow" label="Situação" v-model="gado.situacao" filled readonly/>
            <q-input class="col-grow" label="Data de Nascimento" v-model="gado.dt_nasc" filled readonly/>
          </q-card>

          <q-space />

          <div class="row q-gutter-md q-mt-md">
            <q-card flat bordered class="q-mt-md col-3">
              <q-card-section class="text-white text-center" style="background-color: #0095DA;">
                <div class="text-h6">MGTe</div>
              </q-card-section>
              <q-card-section class="text-center">
                {{ gado.mgte }} (<q-icon name="my_location"/>{{ gado.amgte }})
              </q-card-section>
            </q-card>
            <q-card flat bordered class="q-mt-md col-3">
              <q-card-section class="text-white text-center" style="background-color: #0095DA;">
                <div class="text-h6">TOP</div>
              </q-card-section>
              <q-card-section class="text-center">
                {{ gado.tmgte }}%
              </q-card-section>
            </q-card>
          </div>

          <q-space />

          <q-card flat bordered class="q-mt-md col-3" style="width:100%;min-width:100px">
              <q-card-section class="text-white" style="background-color: #0095DA;">
                <div class="text-h6">DEPs</div>
              </q-card-section>
              <q-card-section class="text-center row q-gutter-sm">
                <q-card flat bordered v-for="dep in deps" :key="dep" class="col-grow" style="max-width: 100px">
                  <q-card-section class="bg-grey text-white">
                    {{ dep.toUpperCase() }}
                  </q-card-section>
                  <q-card-section v-if="gado['d'+dep]">
                    <div></div>{{ gado['d'+dep] }}
                    <br>
                    <q-icon name="my_location"/><span style="color:blue">{{ gado[((dep === 'mtp210') ? 'ad':'a') +dep] }}</span>
                    <br>
                    <q-icon name="emoji_events"/><span style="color: red">{{ gado['t'+dep] }}%</span>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>

            <q-space />

            <q-card flat bordered class="q-mt-md" style="width:100%">
              <q-card-section class="text-white" style="background-color: #0095DA;">
                <div class="text-h6">Genealogia</div>
              </q-card-section>
              <q-card-section class="text-center">
                <vue-tree
                  style="width: 100%; height: 800px; border: 1px solid gray;"
                  :dataset="genealogia"
                  :config="treeConfig"
                  direction="horizontal"
                  linkStyle="straight"
                >
                  <template v-slot:node="{ node }">
                    <div class="genealogic-tree" :class="node.icon">
                      <q-icon class="gender-icon" :class="node.icon" :name="node.icon" size="1rem"/>{{node.nome}}
                      {{node.serie}} / {{node.rgn}} / {{node.rgd}}
                      <br>
                      <div style="background-color: white">
                        <q-icon name="my_location"/><span style="color:blue">{{ node.mtge }}</span>
                        <q-icon name="emoji_events"/><span style="color:red">{{ node.top }}%</span>
                      </div>
                    </div>
                  </template>
                </vue-tree>
              </q-card-section>
            </q-card>

            <q-space />

            <q-card flat bordered class="q-mt-md">
              <q-card-section class="text-white" style="background-color: #0095DA;">
                <div class="text-h6">DEPs Gráficas</div>
              </q-card-section>
              <q-card-section style="display:flex;justify-content: center;width:100%">
                <VueApexCharts style="width: 100%;max-width:700px" type="bar" :options="chartOptions" :series="chartSeries" />
              </q-card-section>
            </q-card>
        </div>

      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="print" color="red" @click="exportToPDF" />
      </q-page-sticky>

      <q-spinner-gears
        v-if="exporting"
        style="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index: 9999;"
        color="red"
        size="4rem"
      />

    </div>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { nextTick, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'
import VueApexCharts from 'vue3-apexcharts'
import html2pdf from 'html2pdf.js'

const route = useRoute()

const macho = ref('Macho')

const exporting = ref(false)

const gado = ref(null)

const genealogia = ref([])

const treeConfig = { nodeWidth: 150, nodeHeight: 200, levelHeight: 180 }

const chartOptions = ref({
  title: {
    text: undefined,
    align: 'left',
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      fontFamily: undefined,
      color: '#263238'
    }
  },
  chart: {
    type: 'bar',
    height: 500,
    selection: {
      enabled: true
    },
    toolbar: {
      show: true
    },
    animations: {
      enabled: false
    },
    redrawOnParentResize: true
  },
  plotOptions: {
    bar: {
      barHeight: '90%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'end',
        hideOverflowingLabels: true,
        orientation: 'horizontal'
      }
    }
  },
  fill: {
    opacity: 0.7
  },
  legend: {
    position: 'right',
    customLegendItems: ['Diamante', 'Esmeralda', 'Rubi', 'Safira', 'Topázio', 'Branco'],
    formatter: function (seriesName, opts) {
      const customLegendItems = [
        'Top 1%',
        'Top 5%',
        'top 10%',
        'top 20%',
        'top 30%',
        'Top Maiores que 30%'
      ]
      return [seriesName, ' ', `<span style="color:black"> - ${customLegendItems[opts.seriesIndex]} </span>`]
    },
    labels: {
      colors: ['#bcdeff', '#50C878', '#E0115F', '#0F52BA', '#FFC87C', '#FFF'],
      useSeriesColors: false
    },
    markers: {
      fillColors: ['#bcdeff', '#50C878', '#E0115F', '#0F52BA', '#FFC87C', '#FFF']
    }
  },
  grid: {
    show: true,
    borderColor: '#383838',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  colors: ['#BFC3C6', '#50C878', '#E0115F', '#0F52BA', '#FFC87C', '#FFF'],
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#08042B']
    },
    formatter: function (val, opt) {
      return dataValues.value[opt.dataPointIndex] + '%'
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#fff',
      opacity: 0.9
    }
  },
  stroke: {
    width: 1,
    colors: ['#000']
  },
  xaxis: {
    categories: ['D3P', 'DSTAY', 'DPE365', 'MP120', 'DP210', 'DP450', 'DAOL', 'DACAB', 'MGTe'],
    labels: {
      show: true,
      formatter: function (value, index) {
        const customLabels = [
          '100%',
          '10%',
          '1%',
          '0.1%'
        ]
        return customLabels[index]
      }
    },
    tickAmount: 3,
    min: 0.1,
    max: 100
  },
  yaxis: {
    labels: {
      show: true
    }
  },
  tooltip: {
    theme: 'dark',
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const category = w.globals.labels[dataPointIndex]
      return `<div class="arrow_box">
                <span>${category}: ${dataValues.value[dataPointIndex]}%</span>
              </div>`
    }
  }
})

const chartSeries = ref([{
  data: []
}])

const deps = ref([
  'dipp',
  'd3p',
  'dipm',
  'mpp120',
  'mpp210',
  'mtp120',
  'mtp210',
  'dstay',
  'dpg',
  'dpn',
  'dpp120',
  'dpp210',
  'dpp365',
  'dpp450',
  'dpav',
  'dcar',
  'dims',
  'dpe365',
  'dpe450',
  'daol',
  'dacab',
  'dmar',
  'dmac',
  'dpcq',
  'dppc',
  'ded',
  'dpd',
  'dmd',
  'des',
  'dps',
  'dms',
  'dalt',
  'dframe'
])

const dataValues = ref([])

function setEmptyValuesToDash (obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
        obj[key] = '-'
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        setEmptyValuesToDash(obj[key]) // Recursive call for nested objects
      }
    }
  }
  return obj
}

function fetchData () {
  const id = route.params.id

  api.get(`consulta-publica/${id}`)
    .then(response => {
      const data = setEmptyValuesToDash(response.data)
      data.dt_nasc = moment(data.dt_nasc).format('DD/MM/YYYY')
      gado.value = data

      chartOptions.value.title.text = `${data.serie}/${data.rgn}/${data.rgd} - ${data.nome}`

      dataValues.value = [
        data.td3p,
        data.tdstay,
        data.tdpe365,
        data.tmpp120,
        data.tdpp210,
        data.tdpp450,
        data.tdaol,
        data.tdacab,
        data.tmgte
      ]

      chartSeries.value[0].data = offsetValues(dataValues.value)

      adjustColorsByThreshold(dataValues.value)

      nextTick(() => {
        genealogia.value = [
          {
            nome: data.nome,
            serie: data.serie,
            rgn: data.rgn,
            rgd: data.rgd,
            mtge: data.mgte,
            top: data.tmgte,
            icon: 'male',
            children: [
              {
                nome: data.mae_nome,
                serie: data.mae_serie,
                rgn: data.mae_rgn,
                rgd: data.mae_rgd,
                mtge: data.mae_mgte,
                top: data.mae_tmgte,
                icon: 'female',
                children: [
                  {
                    nome: data.mmae_nome,
                    serie: data.mmae_serie,
                    rgn: data.mmae_rgn,
                    rgd: data.mmae_rgd,
                    mtge: data.mmae_mgte,
                    top: data.mmae_tmgte,
                    icon: 'female'
                  },
                  {
                    nome: data.pmae_nome,
                    serie: data.pmae_serie,
                    rgn: data.pmae_rgn,
                    rgd: data.pmae_rgd,
                    mtge: data.pmae_mgte,
                    top: data.pmae_tmgte,
                    icon: 'male'
                  }
                ]
              },
              {
                nome: data.pai_nome,
                serie: data.pai_serie,
                rgn: data.pai_rgn,
                rgd: data.pai_rgd,
                mtge: data.pai_mgte,
                top: data.pai_tmgte,
                icon: 'male',
                children: [
                  {
                    nome: data.mpai_nome,
                    serie: data.mpai_serie,
                    rgn: data.mpai_rgn,
                    rgd: data.mpai_rgd,
                    mtge: data.mpai_mgte,
                    top: data.mpai_tmgte,
                    icon: 'female'
                  },
                  {
                    nome: data.ppai_nome,
                    serie: data.ppai_serie,
                    rgn: data.ppai_rgn,
                    rgd: data.ppai_rgd,
                    mtge: data.ppai_mgte,
                    top: data.ppai_tmgte,
                    icon: 'male'
                  }
                ]
              }
            ]
          }
        ]
      })
    })
    .catch(error => {
      console.error(error)
    })
}

function offsetValues (values) {
  const result = []
  values.forEach((value, index) => {
    const complement = getOffset(value)

    result[index] = complement
  })

  return result
}

function getOffset (value) {
  const quadrante = 100 / 3
  if (value === 0.1) {
    return 100
  }
  if (value >= 0.1 && value <= 1) {
    return (((1 - value)) * quadrante) + (2 * quadrante)
  } else if (value > 1 && value <= 10) {
    return (((10 - value - 1) / (10 - 1)) * quadrante) + quadrante
  }

  return (((100 - value - 10) / (100 - 10)) * quadrante)
}

function adjustColorsByThreshold (values) {
  values.forEach((value, index) => {
    if (value > 0 && value <= 1) {
      // DIAMANTE
      chartOptions.value.colors[index] = '#bcdeff'
    } else if (value > 1 && value <= 5) {
      // ESMERALDA
      chartOptions.value.colors[index] = '#50C878'
    } else if (value > 5 && value <= 10) {
      // RUBI
      chartOptions.value.colors[index] = '#E0115F'
    } else if (value > 10 && value <= 20) {
      // SAFIRA
      chartOptions.value.colors[index] = '#0F52BA'
    } else if (value > 20 && value <= 30) {
      // TOPAZIO
      chartOptions.value.colors[index] = '#FFC87C'
    } else {
      // BRANCO
      chartOptions.value.colors[index] = '#FFF'
    }
  })
}

function exportToPDF () {
  exporting.value = true
  const element = document.getElementById('report')

  const options = {
    filename: gado.value.nome + '_report.pdf',
    margin: 0.1,
    html2canvas: {
      scale: 2
    },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    image: { type: 'png', quality: 0.98 },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }

  html2pdf().from(element).set(options).toPdf().save().get('pdf').then(function (pdf) {
    exporting.value = false
    window.open(pdf.output('bloburl'), '_blank')
  })
}

onBeforeMount(() => {
  fetchData()
})

</script>
<style lang="scss">
.spinner-wrapper {
    position: relative;
    display: flex;
    height: 100vh;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.apexcharts-canvas{
  background-color: lightgrey;
  background-image: url('/src/assets/img/logo_ancp_no_text.png');
  background-repeat: no-repeat;
  background-position: bottom right
}

.apexcharts-legend-series {
  background-color: #676669;
  padding: 10px;
  border-radius: 5px;
}

.genealogic-tree {
  position:absolute;
  padding: 10px;
  margin: 10px;
  border-radius: 4px;
  background-color: lightgrey;
  border: 5px solid gray;

  &.male{
    border-color: lightblue !important
  }
  &.female{
    border-color: pink !important
  }

}
.gender-icon{
  position: absolute;
  left:0;
  top:0;
}
</style>
