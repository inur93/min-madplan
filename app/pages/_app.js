import 'semantic-ui-css/semantic.min.css';
import { SWRConfig } from 'swr';
import { isProduction } from '../functions/environmentFunctions';
import '../styles/shared-styles.scss';

function App({ Component, pageProps }) {
    return (<SWRConfig value={{
        focusThrottleInterval: 10000,
        shouldRetryOnError: isProduction() ? true : false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    }}>
        <Component {...pageProps} />
    </SWRConfig>)
}

export default App;