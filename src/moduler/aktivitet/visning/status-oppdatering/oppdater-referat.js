import React from 'react';
import PT from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
import classNames from 'classnames';
import Knapp from 'nav-frontend-knapper/src/knapp';
import { Hovedknapp } from 'nav-frontend-knapper';
import * as AppPT from '../../../../proptypes';
import hiddenIf, {
    div as HiddenIfDiv,
} from '../../../../felles-komponenter/hidden-if/hidden-if';
import OppdaterReferatForm from './oppdater-referat-form';

const HiddenIfTekstomrade = hiddenIf(Tekstomrade);

function OppdaterReferat({
    className,
    aktivitet,
    referat,
    erVeileder,
    visOppdaterReferatForm,
    dispatchPubliserReferat,
    publiserer,
    erReferatPublisert,
    startOppdaterReferat,
    stoppOppdaterReferat,
}) {
    return (
        <div className={classNames('oppdater-referat', className)}>
            <Undertittel>
                <FormattedMessage id="referat.header" />
            </Undertittel>
            <HiddenIfTekstomrade
                className="oppdater-referat__referat"
                hidden={visOppdaterReferatForm}
            >
                {referat}
            </HiddenIfTekstomrade>
            <HiddenIfDiv hidden={!erVeileder}>
                <HiddenIfDiv hidden={visOppdaterReferatForm}>
                    <Hovedknapp
                        onClick={dispatchPubliserReferat}
                        spinner={publiserer}
                        disabled={erReferatPublisert}
                    >
                        <FormattedMessage id="referat.publiser" />
                    </Hovedknapp>
                    <Knapp onClick={startOppdaterReferat}>
                        <FormattedMessage id="referat.oppdater" />
                    </Knapp>
                </HiddenIfDiv>

                <OppdaterReferatForm
                    aktivitet={aktivitet}
                    hidden={!visOppdaterReferatForm}
                    onFerdig={stoppOppdaterReferat}
                />
            </HiddenIfDiv>
        </div>
    );
}

OppdaterReferat.propTypes = {
    className: PT.string,
    referat: PT.string,
    aktivitet: AppPT.aktivitet.isRequired,
    erVeileder: PT.bool.isRequired,
    visOppdaterReferatForm: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    publiserer: PT.bool.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    startOppdaterReferat: PT.func.isRequired,
    stoppOppdaterReferat: PT.func.isRequired,
};

OppdaterReferat.defaultProps = {
    className: undefined,
    referat: undefined,
};

export default OppdaterReferat;
