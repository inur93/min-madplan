import useSWR from "swr";
import { GetRecipesApi } from "../../_api";
import { useRouter } from "next/router";



export function useRecipeDetails() {
    const api = GetRecipesApi();
    const router = useRouter();

    const {
        data: recipe,
        isValidating: reloading
    } = useSWR(router.query.id ? ['/recipes', router.query.id] : null,
        (url, id) => api.findOne(id));

    const state = {
        recipe,
        loading: !recipe
    }

    return [state];
}