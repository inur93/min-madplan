import { GetPageSettingsApi } from "../api";
import useSWR from "swr";


export function usePageSettings(key) {
    const api = GetPageSettingsApi();
    const { data: settings } = useSWR('page-settings', () => api.get());

    if (key && settings) {
        return settings[key];
    }
    
    return settings;
}