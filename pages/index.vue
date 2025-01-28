<template>
  <v-container>
    <v-alert class="mb-4" :color="obs.identified ? 'success' : 'error'">
      OBS connected: {{ obs.identified }}
    </v-alert>
    <v-text-field v-for="(value, key) in inputs" :key="key" :label="key" v-model="inputs[key]" type="text"/>
  </v-container>
</template>

<script lang="ts" setup>
  import {useObs} from "~/composables/useObs";
  import {useObsSources} from "~/composables/useObsSources";
  const obs = useObs()
  const inputs = useObsSources()
</script>
