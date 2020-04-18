import { GetShoppingListApi } from "../../_api";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useView, views } from "../useView";


export function useShoppingListContextMenu() {
    const api = GetShoppingListApi();
    const router = useRouter();
    const [show, edit, goTo] = useView('/shopping-list');

    const menu = [];
    if (show.details) {
        menu.push({
            label: 'Slet',
            onClick: async () => {
                goTo.history();
                await api.delete(router.query.id);
                mutate('shopping-lists');
            }
        })
    }

    return [menu];
}
