import { Icon, Loader } from "semantic-ui-react";


export function Page({ children, title, loading }) {
    return <div className='page-component'>
        <div className='flex row'>
            {title && <h2 className='fill'>{title}</h2>}
            <Loader className='shrink' size='small' inline active={loading} />
        </div>
        {children}
    </div>
}