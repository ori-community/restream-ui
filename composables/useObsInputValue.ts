import {useObs} from '~/composables/useObs'
import {toValue} from '@vue/reactivity'
import type {JsonValue} from 'type-fest'
import type {UnwrapRef} from 'vue'

export const useObsInputValue = <T extends JsonValue>(inputName: string, inputSettingsKey: string, defaultValue: T, readInitialValueFromObs: boolean = false) => {
    const obs = useObs()
    const valueRef = ref<T>(toValue(defaultValue))
    let initialReadDone = false

    async function readValueFromObs() {
        const currentValue = (await obs.value.call('GetInputSettings', {inputName})).inputSettings[inputSettingsKey]
        valueRef.value = currentValue as unknown as UnwrapRef<T>
    }

    async function writeValueToObs() {
        await obs.value.call('SetInputSettings', {
            inputName,
            inputSettings: {
                // @ts-ignore
                [inputSettingsKey]: valueRef.value,
            },
            overlay: true,
        })
    }

    watch(() => obs.value.identified, async () => {
      if (obs.value.identified) {
          if (readInitialValueFromObs && !initialReadDone) {
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
