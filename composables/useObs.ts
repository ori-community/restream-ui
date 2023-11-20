import OBSWebSocket, {EventSubscription} from "obs-websocket-js";
import {readonly} from "@vue/reactivity";
import {sleep} from "~/utils/async-sleep";

const obs = ref(new OBSWebSocket())

let tryingToConnectToObs = false
async function tryConnectToObs() {
    if (tryingToConnectToObs) {
        return
    }

    tryingToConnectToObs = true

    while (tryingToConnectToObs) {
        try {
            await obs.value.connect('ws://127.0.0.1:4455', '123456', {
                eventSubscriptions: EventSubscription.All,
            })
            tryingToConnectToObs = false
        } catch (e) {
            console.error('Failed to connect to OBS, retrying in 3s', e)
            await sleep(3000)
        }
    }
}

export const useObs = () => {
    if (!obs.value.identified) {
        tryConnectToObs()
    }

    return obs
}