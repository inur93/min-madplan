import 'semantic-ui-css/semantic.min.css';
import { SWRConfig } from 'swr';
import { isProduction } from '../functions/environmentFunctions';
import '../styles/shared-styles.scss';
import { useState } from 'react';

let timerId;
function App({ Component, pageProps }) {
    const [isSlow, setSlow] = useState(false);
    return (<SWRConfig value={{
        focusThrottleInterval: 10000,
        shouldRetryOnError: isProduction() ? true : false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        loadingTimeout: 500,//3000, //set to 500 for testing
        onLoadingSlow: () => {
            setSlow(true);
            if(timerId) clearTimeout(timerId);
            timerId = setTimeout(() => setSlow(false), 15000);
        }
    }}>
        <Component {...pageProps} />
    </SWRConfig>)
}

export default App;