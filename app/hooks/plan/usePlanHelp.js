import { useView } from "../useView";
import { useSelf } from "../useSelf";
import { GetUsersApi } from "../../_api";
import { mutate } from "swr";
import { useState, useEffect } from "react";


const helpTexts = {
    history: {
        help: {
            text: 'Hjælp til history'
        }

    },
    details: {
        help: {
            text: 'Hjælp til detaljer',
        },
    }
}
function getText(arr, obj) {
    const [key, ...rest] = arr;
    const nestedObj = obj[key];
    if (!nestedObj) return null;
    console.log('text', { arr, obj });
    return getText(rest, nestedObj) || nestedObj.help;
}
function getHelpText(keys, self) {
    const key = keys.join('-');
    if (!self || (self.helpComplete || {})[key]) return null;
    return getText(keys, helpTexts);
}

function getKey(view, edit) {
    let key = [view];
    if (edit) key.push('edit');
    return key;
}
export function usePlanHelp() {
    const api = GetUsersApi();
    const [show, edit, goTo] = useView('plan');
    const [self] = useSelf();
    const [help, setHelp] = useState(null);

    useEffect(() => {
        let key = getKey(show.view, edit);
        setHelp(getHelpText(key, self));
    }, [self, show, edit])


    const dismiss = async () => {
        const key = getKey(show.view, edit);
        await api.update(self._id, {
            helpComplete: {
                ...self.helpComplete,
                [key]: true
            }
        })
        mutate('/me');
    }

    return [help, dismiss];
}