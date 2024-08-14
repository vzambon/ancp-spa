<template>
  <div>
    <div v-if="childrenSet.length == 0">
      <q-item clickable v-ripple :inset-level="level" @click="navTo(nav)">
        <q-item-section v-if="props.icon" avatar>
          <q-icon :name="props.icon" />
        </q-item-section>
        <q-item-section>{{ title }}</q-item-section>
      </q-item>
    </div>
    <div v-else>
      <div v-if="childrenSet.length > 0">
        <!-- ===== CHILDREN ===== -->
        <q-expansion-item
          expand-separator
          :icon="icon"
          :label="title"
          :caption="caption"
          :header-inset-level="level"
          default-closed
        >
          <EssentialLink
            v-for="child in childrenSet"
            :key="child"
            v-bind="child"
          >
          </EssentialLink>
        </q-expansion-item>
      </div>
      <div v-else>
        <q-item clickable v-ripple :inset-level="level">
          <q-item-section>{{ title }}</q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'EssentialLink'
})

const router = useRouter()

const childrenSet = computed(() =>
  props.children.map((el) => {
    el.level = props.level + 1
    return el
  })
)

const props = defineProps({
  level: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  },
  children: {
    type: Array,
    default: () => []
  },
  nav: {
    type: String,
    default: ''
  }
})

function navTo (path) {
  router.push(path)
}

onMounted(() => {})
</script>
