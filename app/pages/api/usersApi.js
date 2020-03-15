import useSWR from 'swr';
import {api} from './api';

export function self(){
    const {data} = useSWR('/users', path => {
        return api.get(path);
    });
    
    if(!data) return {isLoading: true};

    return {
        isLoading: false,
        me: data || []
    };
}