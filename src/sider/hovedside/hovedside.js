import React from 'react';
import PT from 'prop-types';
import { Container } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../../moduler/filter/filter';
import Feil from './feil/feil';
import Varslinger from '../../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';

function Hovedside({ children }) {
    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <Container className="hovedsideinnhold__meny-container blokk-s">
                    <Feil />
                    <Varslinger />
                    <Navigasjonslinje />
                    <div className="hovedside__verktoylinje">
                        <Lenkeknapp href="/aktivitet/ny">
                            <FormattedMessage id="nyaktivitetsknapp" />
                        </Lenkeknapp>
                        <Filter />
                    </div>
                </Container>
                <AktivitetsTavle />
            </div>
            {children}
        </div>
    );
}

Hovedside.defaultProps = {
    children: null,
    routes: null,
};

Hovedside.propTypes = {
    children: PT.node,
};

Hovedside.defaultProps = {
    children: undefined,
};

export default Hovedside;
