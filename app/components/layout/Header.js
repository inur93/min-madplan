import React from 'react';
import { useRouter } from 'next/router';
import { Segment, Header as HeaderSUI, Dropdown, Progress } from 'semantic-ui-react';
import { ButtonMenu } from '../shared/Button';

import './header.scss';

const Header = ({ showBackBtn, title, showMenu, loading, ...otherProps }) => {
    const { pathname } = useRouter();
    //indkøbsliste
    //ugeplan
    //opskrifter
    return (
        <div className="mmp-header">
            <Segment clearing>
                <ButtonMenu onClick={showMenu} />

                <HeaderSUI className="custom-header" as='h1' floated='left'>
                    {title}
                </HeaderSUI>
                <Dropdown icon="ellipsis vertical"
                    value=""
                    className="settings-icon"
                    floating
                    size='large'
                    options={[
                        { key: 'delete', text: 'Delete', value: 'delete' },
                        { key: 'edit', text: 'edit', value: 'edit' }
                    ]} />
            </Segment>
            {loading && <Progress percent={100} active size='tiny' color='blue' />}
        </div>)
}

export default Header;