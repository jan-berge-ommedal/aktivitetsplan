import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './aktivitet-etikett.less';
import visibleIfHOC from '../hocs/visible-if';
import * as statuskoder from '../constant';

const cls = (type) => classNames('etikett', `etikett--${type}`);
const setType = (etikettnavn) => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
        case statuskoder.DIALOG_FERDIGBEHANDLET:
            return 'ok';
        case statuskoder.INNKALT_TIL_INTERVJU:
        case statuskoder.JOBBTILBUD:
            return 'info';
        case statuskoder.AVSLAG:
            return 'varsling';
        case statuskoder.DIALOG_MA_BESVARES:
            return 'feil';
        case statuskoder.AVTALT_MED_NAV:
            return 'avtalt';
        default:
            return '';
    }
};

function AktivitetEtikett({ etikett, id }) {
    return (
        <span key={etikett} className={cls(setType(etikett))}>
            <FormattedMessage id={id} />
        </span>
    );
}

AktivitetEtikett.propTypes = {
    etikett: PT.string.isRequired,
    id: PT.string.isRequired
};

export default visibleIfHOC(AktivitetEtikett);
