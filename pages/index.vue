<template>
  <v-container>
    <v-alert class="mb-4" :color="obs.identified ? 'success' : 'error'">
      OBS connected: {{ obs.identified }}
    </v-alert>
    <div>
      <v-text-field v-model="myText1" type="text" />
      <v-text-field v-model="myText2" type="text" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import {useObs} from "~/composables/useObs";
  import {useObsInputValue} from '~/composables/useObsInputValue'

  const obs = useObs()
  const myText1 = useObsInputValue('TestText1', 'text', 'greets to greez')  // This one will be initialized to defaultValue and will override whatever is in OBS
  const myText2 = useObsInputValue('TestText2', 'text', '', true)  // This one will be initialized to defaultValue but will be replaced with whatever is in OBS at startup
</script>
