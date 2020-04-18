import { GetPlanApi } from "../../_api";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useView, views } from "../useView";


export function usePlanContextMenu() {
    const api = GetPlanApi();
    const router = useRouter();
    const [show, edit, goTo] = useView('/plan');

    const menu = [];
    if (show.details) {
        menu.push({
            label: 'Slet',
            onClick: async () => {
                goTo.history();
                await api.delete(router.query.id);
                mutate('/food-plans');
            }
        })
    }

    return [menu];
}
