import React, { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Segment, Header as HeaderSUI, Dropdown, Button } from 'semantic-ui-react';
import { ButtonBack, ButtonMenu } from '../shared/Button';
import Menu from './Menu';

import './header.scss';

const Header = ({ showBackBtn, title, showMenu, ...otherProps }) => {
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
        </div>)
}

export default Header;