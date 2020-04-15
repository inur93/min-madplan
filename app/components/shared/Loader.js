
import { Loader as LoaderSUI } from 'semantic-ui-react';


export function Loader({ loading, children }) {

    if (loading) return <LoaderSUI active size='massive' >
        loading...
        </LoaderSUI>
    return (<div>
        {children}
    </div>)
}