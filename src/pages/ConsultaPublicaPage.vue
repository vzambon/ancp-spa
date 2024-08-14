<template>
    <div class="q-pa-lg">
        <h2>Consulta Pública de Machos Jovens e Touros</h2>
        <q-card>
            <q-card-section>
                <q-form @submit="onSubmit">
                    <div class="row q-gutter-md q-pa-md">
                        <RemoteSelect class="col-grow col-3" label="Raça" route="consulta-publica/select/raca" plainArray @selected="(val) => {basicFilter.raca = val} "/>
                        <RemoteSelect class="col-grow col-3" label="Central" route="consulta-publica/select/central" plainArray @selected="(val) => {basicFilter.central = val} "/>
                        <RemoteSelect class="col-grow col-3" label="Reprodução Programada" route="consulta-publica/select/rep_prog" plainArray @selected="(val) => {basicFilter.rep_prog = val} "/>
                    </div>

                    <label>Filtros: </label>
                    <q-list bordered class="rounded-borders">
                        <q-expansion-item
                            header-class="bg-blue text-white"
                            group="filters"
                            expand-separator
                            icon="fingerprint"
                            label="Por Animal"
                            default-opened
                            @show="onExpand('porAnimal')"
                        >
                            <div class="row q-gutter-md q-mt-md q-pa-md">
                                <q-input filled label="Série" v-model="porAnimal.serie"/>
                                <q-input filled label="RGN" v-model="porAnimal.rgn" />
                                <q-input filled label="RGD" v-model="porAnimal.rgd" />
                                <GadoSelectBy class="col-grow" label="Nome" valueField="nome" @selected="(e) => {porAnimal.nome = e?.value ?? null}"/>
                            </div>
                        </q-expansion-item>
                        <q-expansion-item
                            header-class="bg-blue text-white"
                            group="filters"
                            expand-separator
                            icon="workspaces"
                            label="Por Grupo"
                            @show="onExpand('porGrupo')"
                        >
                            <div class="q-mt-md q-pa-md">
                                <div class="row q-gutter-md">
                                    <RemoteSelect class="col-grow col-3" label="Categoria" route="consulta-publica/select/categoria" plainArray @selected="(val) => {porGrupo.categoria = val}" />
                                    <RemoteSelect class="col-grow col-3" label="Variedade" route="consulta-publica/select/variedade" plainArray @selected="(val) => {porGrupo.variedade = val}" />
                                    <RemoteSelect class="col-grow col-3" label="Situação" route="consulta-publica/select/situacao" plainArray @selected="(val) => {porGrupo.situacao = val}" />
                                </div>
                                <label>Nascido em:</label>
                                <div class="row q-gutter-md">
                                    <DateInput
                                        class="col-3"
                                        label="Nascimento (Data Inicial)"
                                        :until="moment().format('YYYY-MM-DD')"
                                        v-model="porGrupo.dt_nasc"
                                    />
                                    <DateInput
                                        class="col-3"
                                        label="Nascimento (Data Final)"
                                        :from="moment(porGrupo.dt_nasc).format('YYYY-MM-DD')"
                                        :until="moment().format('YYYY-MM-DD')"
                                        v-model="porGrupo.dt_nasc_final"
                                    />
                                </div>
                            </div>
                        </q-expansion-item>
                        <q-expansion-item
                            header-class="bg-blue text-white"
                            group="filters"
                            expand-separator
                            icon="account_tree"
                            label="Genealogia"
                            @show="onExpand('genealogia')"
                        >
                            <div class="row q-gutter-md q-mt-md q-pa-md">
                                <label for="">Mãe:</label>
                                <q-input filled label="Série" v-model="genealogia.mae_serie"/>
                                <q-input filled label="RGN" v-model="genealogia.mae_rgn" />
                                <q-input filled label="RGD" v-model="genealogia.mae_rgd" />
                            </div>
                            <div class="row q-gutter-md q-mt-md q-pa-md">
                                <label for="">Pai:</label>
                                <q-input filled label="Série" v-model="genealogia.pai_serie"/>
                                <q-input filled label="RGN" v-model="genealogia.pai_rgn" />
                                <q-input filled label="RGD" v-model="genealogia.pai_rgd" />
                            </div>
                        </q-expansion-item>
                    </q-list>
                    <div style="display: flex;justify-content: center;margin-top: 20px;">
                        <q-btn type="submit">Pesquisar</q-btn>
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import GadoSelectBy from 'src/components/GadoSelectBy.vue'
import RemoteSelect from 'src/components/RemoteSelect.vue'
import DateInput from 'src/components/DateInput.vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const router = useRouter()

const basicFilter = ref({
  raca: '',
  central: '',
  rep_prog: ''
})

const genealogia = ref({
  mae_serie: '',
  mae_rgn: '',
  mae_rgd: '',
  pai_serie: '',
  pai_rgn: '',
  pai_rgd: ''
})

const porAnimal = ref({
  serie: '',
  rgn: '',
  rgd: '',
  nome: ''
})

const porGrupo = ref({
  categoria: '',
  variedade: '',
  situacao: '',
  dt_nasc: null,
  dt_nasc_final: null
})

const selectedFilter = ref(porAnimal.value)

watch(() => porGrupo.value.dt_nasc, (val) => {
  porGrupo.value.dt_nasc_final = val
})

function onSubmit () {
  router.push({ path: '/free/consulta-publica/list', query: { search: JSON.stringify({ ...selectedFilter.value, ...basicFilter.value }) } })
}

function onExpand (type) {
  switch (type) {
    case 'porAnimal':
      selectedFilter.value = porAnimal.value
      break
    case 'porGrupo':
      selectedFilter.value = porGrupo.value
      break
    case 'genealogia':
      selectedFilter.value = genealogia.value
      break
  };
}
</script>
<style lang="scss">

</style>
