import {useObs} from '~/composables/useObs'
import type {JsonObject} from 'type-fest'

export const useObsSource = (inputName: string) => {

    const obs = useObs()

    let initialReadDone = false
    let valueRef = ref('')

    async function readValueFromObs() {
        const currentValue = (await obs.value.call('GetInputSettings', {inputName})).inputSettings.text
        valueRef.value = currentValue as string
    }

    async function writeValueToObs() {
        await obs.value.call('SetInputSettings', {
            inputName,
            inputSettings: {
                // @ts-ignore
                ['text']: valueRef.value,
            },
            overlay: true,
        })
    }

    watch(() => obs.value.identified, async () => {
      if (obs.value.identified) {
          if (!initialReadDone) {
              await readValueFromObs()
              initialReadDone = true
          }
          await writeValueToObs()
      } else {
          initialReadDone = false
      }
    }, {immediate: true})

    watch(valueRef, async () => {
        await writeValueToObs()
    })

    return valueRef
}
