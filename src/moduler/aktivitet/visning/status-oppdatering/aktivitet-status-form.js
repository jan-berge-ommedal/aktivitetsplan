import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import { aktivitet as aktivitetPT } from '../../../../proptypes';
import { STATUS } from '../../../../ducks/utils';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { HiddenIfAlertStripeInfo } from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import visibleIf from '../../../../hocs/visible-if';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import { manglerPubliseringAvSamtaleReferat } from '../../aktivitet-util';
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    INGEN_VALGT,
} from '../../../../constant';
import { selectAktivitetListeStatus } from '../../aktivitetliste-selector';

const AKTIVITET_STATUS_FORM_NAME = 'aktivitet-status-form';
const MAKS_LENGDE = 255;

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripeInfoSolid);

function statusKreverBegrunnelse(status) {
    return status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
}

function AktivitetStatusForm(props) {
    const {
        aktivitet,
        dirty,
        handleSubmit,
        aktivitetDataStatus,
        valgtAktivitetStatus,
        disableStatusEndring,
        errorSummary,
        manglerReferatPublisering,
    } = props;
    const lasterData = aktivitetDataStatus !== STATUS.OK;
    const visAdvarsel = statusKreverBegrunnelse(valgtAktivitetStatus);

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col col-xs-6">
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.brukerErInteressert" />
                        }
                        value={STATUS_BRUKER_ER_INTRESSERT}
                        id={`id--${STATUS_BRUKER_ER_INTRESSERT}`}
                        disabled={disableStatusEndring || lasterData}
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.planlagt" />
                        }
                        value={STATUS_PLANLAGT}
                        id={`id--${STATUS_PLANLAGT}`}
                        disabled={disableStatusEndring || lasterData}
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.gjennomfoert" />
                        }
                        value={STATUS_GJENNOMFOERT}
                        id={`id--${STATUS_GJENNOMFOERT}`}
                        disabled={disableStatusEndring || lasterData}
                    />
                </div>
                <div className="col col-xs-6">
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.fullfoert" />
                        }
                        value={STATUS_FULLFOERT}
                        id={`id--${STATUS_FULLFOERT}`}
                        disabled={
                            disableStatusEndring ||
                            lasterData ||
                            manglerReferatPublisering
                        }
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.avbrutt" />
                        }
                        value={STATUS_AVBRUTT}
                        id={`id--${STATUS_AVBRUTT}`}
                        disabled={
                            disableStatusEndring ||
                            lasterData ||
                            manglerReferatPublisering
                        }
                    />
                </div>
            </div>

            <HiddenIfAlertStripeInfo hidden={!manglerReferatPublisering}>
                <FormattedMessage id="aktivitetstatus.mangler-publisering-av-samtalereferat" />
            </HiddenIfAlertStripeInfo>

            <VisibleIfDiv className="status-alert" visible={dirty}>
                <VisibleAlertStripeSuksessSolid
                    visible={visAdvarsel}
                    role="alert"
                >
                    <FormattedMessage id="aktivitetstatus.oppdater-status-advarsel" />
                </VisibleAlertStripeSuksessSolid>

                {errorSummary}

                <VisibleIfDiv visible={aktivitet.avtalt && visAdvarsel}>
                    <Textarea
                        labelId={
                            <FormattedMessage
                                id="aktivitetstatus.oppdater-status-begrunnelse"
                                values={{ valgtAktivitetStatus }}
                            />
                        }
                        feltNavn="begrunnelse"
                        name="begrunnelse-aktivitet"
                        maxLength={MAKS_LENGDE}
                        disabled={lasterData}
                    />
                </VisibleIfDiv>

                <Hovedknapp
                    spinner={lasterData}
                    mini
                    autoDisableVedSpinner
                    className="knapp--mini oppdater-status"
                >
                    <FormattedMessage id="aktivitetstatus.bekreft-knapp" />
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

const ikkeForLangBegrunnelse = maksLengde(
    'opprett-begrunnelse.melding.feilmelding.for-lang',
    MAKS_LENGDE
);
const harBegrunnelse = pakrevd(
    'opprett-begrunnelse.melding.feilmelding.for-kort'
);
const harBegrunnelseHvisAvtaltOgPakrevdForStatus = (begrunnelse, props) =>
    props.aktivitet.avtalt &&
    statusKreverBegrunnelse(props.values.aktivitetstatus) &&
    harBegrunnelse(begrunnelse, props);

function kanOppdatereStatus() {
    return (ignored, props) => {
        const ferdigStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(
            props.valgtAktivitetStatus
        );
        return (
            ferdigStatus &&
            manglerPubliseringAvSamtaleReferat(props.aktivitet || {}) &&
            <FormattedMessage id="referat.validering.ikke-publisert" />
        );
    };
}

const OppdaterReduxForm = validForm({
    form: AKTIVITET_STATUS_FORM_NAME,
    errorSummaryTitle: (
        <FormattedMessage id="aktivitetstatus.form.feiloppsummering-tittel" />
    ),
    validate: {
        begrunnelse: [
            ikkeForLangBegrunnelse,
            harBegrunnelseHvisAvtaltOgPakrevdForStatus,
        ],
        kanOppdatereStatus: kanOppdatereStatus(),
    },
})(AktivitetStatusForm);

AktivitetStatusForm.defaultProps = {
    valgtAktivitetStatus: INGEN_VALGT,
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    manglerReferatPublisering: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
    dirty: PT.bool.isRequired,
    valgtAktivitetStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    aktivitetDataStatus: PT.string,
    errorSummary: PT.node.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const { status, avsluttetKommentar } = aktivitet;
    return {
        aktivitetDataStatus: selectAktivitetListeStatus(state),
        valgtAktivitetStatus: formValueSelector(AKTIVITET_STATUS_FORM_NAME)(
            state,
            'aktivitetstatus'
        ),
        manglerReferatPublisering: manglerPubliseringAvSamtaleReferat(
            aktivitet
        ),
        initialValues: {
            begrunnelse: avsluttetKommentar,
            aktivitetstatus: status,
        },
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (values, dispatch, props) => {
        dispatch(
            flyttAktivitetMedBegrunnelse(
                props.aktivitet,
                values.aktivitetstatus,
                values.begrunnelse
            )
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
