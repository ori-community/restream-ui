import {useObs} from '~/composables/useObs'
import {useObsSource} from '~/composables/useObsSource'
import type {JsonObject} from 'type-fest'

export const useObsSources = () => {
    const obs = useObs()
    let initialReadDone = false
    let valueRef = ref({})

    async function getInputList() {
        const inputs = (await obs.value.call('GetInputList', {inputKind: 'text_gdiplus_v2'}))['inputs']
        for(const input of inputs) {
            insertInput(input)
        }
        console.log('Initial input list', valueRef.value)
    }

    obs.value.on('InputRemoved', removeInput)
    function removeInput(input: JsonObject) {
        console.log('removeInput', input)
        delete valueRef.value[input.inputName]
    }

    obs.value.on('InputCreated', insertInput)
    function insertInput(input: JsonObject) {
        console.log('insertInput', input)
        if (input.inputKind == 'text_gdiplus_v2') {
            valueRef.value[input.inputName] = useObsSource(input.inputName)
        }
    }

    watch(() => obs.value.identified, async () => {
      if (obs.value.identified) {
          if (!initialReadDone) {
              await getInputList()
              initialReadDone = true
          }
      } else {
          initialReadDone = false
      }
    }, {immediate: true})

    return valueRef
}
