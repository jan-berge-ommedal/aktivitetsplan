import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from '../../felles-komponenter/utils/lenke';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import Checkbox from '../../felles-komponenter/skjema/input/checkbox';
import history from '../../history';
import {
    godtaVilkar,
    avslaVilkar,
} from '../oppfolging-status/oppfolging-reducer';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { STATUS } from '../../ducks/utils';
import * as AppPT from '../../proptypes';

function GodkjennVilkarForm({
    visVilkar,
    handleSubmit,
    reset,
    doAvslaVilkar,
    oppfolgingStatus,
}) {
    const lasterData = oppfolgingStatus !== STATUS.OK;
    const avsla = () => {
        doAvslaVilkar();
        reset();
    };

    return (
        <form className="godkjenn-vilkar" onSubmit={handleSubmit}>
            <div className="godkjenn-vilkar__avkryssning">
                <Lenke href="/vilkar" visible={!visVilkar}>
                    <FormattedMessage id="vilkar.se-vilkar-her" />
                </Lenke>
                <Checkbox
                    className="godkjenn-vilkar__avkryssningsboks"
                    feltNavn="godkjent"
                    labelId={
                        visVilkar
                            ? 'vilkar.ja-jeg-samtykker'
                            : 'vilkar.ja-ta-i-bruk'
                    }
                />
            </div>

            <div>
                <Hovedknapp spinner={lasterData} disabled={lasterData}>
                    <FormattedMessage id="vilkar.ga-til-aktivitetsplan" />
                </Hovedknapp>
            </div>

            <div>
                <Knappelenke onClick={avsla} visible={!!visVilkar}>
                    <FormattedMessage id="vilkar.avsla-vilkar" />
                </Knappelenke>
            </div>
        </form>
    );
}

GodkjennVilkarForm.propTypes = {
    reset: PT.func.isRequired,
    visVilkar: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
    doAvslaVilkar: PT.func.isRequired,
    oppfolgingStatus: AppPT.status.isRequired,
};

const pakrevdGodkjenning = value =>
    value !== true && <FormattedMessage id={'vilkar.ma-krysse-av'} />;

const formNavn = 'godkjenn-vilkar';
const GodkjennVilkarReduxForm = validForm({
    form: formNavn,
    destroyOnUnmount: false,
    validate: {
        godkjent: [pakrevdGodkjenning],
    },
})(GodkjennVilkarForm);

const mapStateToProps = state => ({
    oppfolgingStatus: selectOppfolgingStatus(state),
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const doAvslaVilkar = () => {
        dispatch(avslaVilkar(ownProps.hash));
        history.push('/');
    };
    const doGodtaVilkar = () => {
        dispatch(godtaVilkar(ownProps.hash));
        history.push('/');
    };
    return {
        onSubmit: formData => {
            if (formData.godkjent === true) {
                doGodtaVilkar();
            }
        },
        doAvslaVilkar,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    GodkjennVilkarReduxForm
);
