import { GetPageSettingsApi } from "../pages/api";
import useSWR from "swr";


export function usePageSettings(key) {
    const api = GetPageSettingsApi();
    const { data: settings } = useSWR('page-settings', () => api.get());

    console.log('settings', settings);
    if (key && settings) {
        return settings[key];
    }
    
    return settings;
}