import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

function Loading() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url) => (url !== router.pathname) && setLoading(true);
        const handleComplete = (url) => (url !== router.pathname) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    return loading && (<Dimmer active>
        <Loader size='massive'>Loading...</Loader>
    </Dimmer>);
}

export default Loading;