import { useView } from "../useView";
import { useSelf } from "../useSelf";
import { GetUsersApi } from "../../_api";
import { mutate } from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";


const helpTexts = {
    ['/shopping-list']: {
        details: {
            help: {
                header: 'Sådan bruger du indkøbslisten',
                text: () => <div>
                    Her kan du krydse af de varer du har købt.
                    For at tilføje flere varer til listen, kan du klikke på
                    {' '}<Icon name='edit' />.
                </div>
            },
            edit: {
                help: {
                    header: 'Rette i indkøbslisten',
                    text: () => <div>
                        Skriv i søgefeltet herunder for at tilføje varer til indkøbslisten.
                        Du kan klikke på varen for at redigere antal og enhed.
                        Når du er færdig, kan du klikke på {' '}<Icon name='edit' />
                    </div>
                }
            }
        },
        history: {
            help: {
                header: 'Indkøbslister',
                text: () => <div>
                    Her kan du se dine indkøbslister. Klik på en eksisterende eller tryk
                    på <Icon name='add' /> for at tilføje en ny.
                    For at komme tilbage til listen tryk på <Icon name='history' />
                </div>
            }
        },
        create: {
            help: {
                header: 'Opret indkøbsliste',
                text: () => <div>
                    Giv indkøbslisten et navn og hvornår den skal gælde fra.
                    Datoen bruges til sortering, så du ikke blander listerne sammen.
                </div>
            }
        }
    },
    ['/plan']: {
        history: {
            help: {
                header: 'Ugeplan',
                text: () => <div>
                    Her kan du se dine madplaner for de enkelte uger.
                    Klik på en af dem på listen eller klik på <Icon name='calendar plus outline' />
                    {' '}for at oprette en ny ugeplan.
                </div>
            }
        },
        create: {
            help: {
                header: 'Opret ugeplan',
                text: () => <div>
                    Giv din ugeplan et navn og hvornår den gælder fra.
                    Som standard gælder den fra kommende mandag.
                </div>
            }
        },
        details: {
            help: {
                header: 'Udfyld ugeplan',
                text: () => <div>
                    Tryk på en af dagene for at vælge den ret du ønsker dig den dag.
                    Når du er færdig kan trykke på <Icon name='add to cart' /> så opretter vi
                    en indkøbsliste med alt det du skal bruge.
                </div>
            }
        }
    }
}
function getText(arr, obj) {
    const [key, ...rest] = arr;
    const nestedObj = obj[key];
    if (!nestedObj) return null;
    return getText(rest, nestedObj) || nestedObj.help;
}
function getHelpText(keys, self) {
    const key = getKeyStr(keys);
    if (!self || (self.helpComplete || {})[key]) return null;
    return getText(keys, helpTexts);
}

function getKey(page, view, edit) {
    let key = [page, view];
    if (edit) key.push('edit');
    return key;
}

function getKeyStr(keys) {
    const key = keys.join('-');
    return key;
}
export function useHelpButton() {
    const api = GetUsersApi();
    const [isAvailable, setAvailable] = useState(false);
    const [self] = useSelf();
    const [show, edit] = useView();
    const router = useRouter();
    useEffect(() => {
        const keys = getKey(router.pathname, show, edit);
        setAvailable(null !== getHelpText(keys, {}));
    }, [router.pathname, show, edit]);

    const showHelp = () => {
        const key = getKey(router.pathname, show.view, edit);
        const keyStr = getKeyStr(key);
        mutate('/me', {
            ...self,
            helpComplete: {
                ...self.helpComplete,
                [keyStr]: false
            }
        }, false);
        mutate('/me', api.update(self._id, {
            helpComplete: {
                ...self.helpComplete,
                [keyStr]: false
            }
        }));
    }

    return [isAvailable, showHelp];
}
export function useHelp() {
    const api = GetUsersApi();
    const [show, edit] = useView();
    const router = useRouter();
    const [self] = useSelf();
    const [help, setHelp] = useState(null);

    useEffect(() => {
        let key = getKey(router.pathname, show.view, edit);
        setHelp(getHelpText(key, self));
    }, [router.pathname, self, show, edit])


    const dismiss = async () => {
        const key = getKey(router.pathname, show.view, edit);
        const keyStr = getKeyStr(key);
        mutate('/me', {
            ...self,
            helpComplete: {
                ...self.helpComplete,
                [keyStr]: true
            }
        }, false);
        mutate('/me', api.update(self._id, {
            helpComplete: {
                ...self.helpComplete,
                [keyStr]: true
            }
        }));
    }

    return [help, dismiss];
}