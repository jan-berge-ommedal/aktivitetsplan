import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { formValueSelector, change } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { OPPRETT_OPPGAVE_FORM } from './opprett-oppgave';
import {
    begrensetBeskrivelseLengde,
    beskrivelsePakrevd,
    defaultPrioritet,
    erValgtEnhetLikInnloggetEnhet,
    getEnhetFromUrl,
    oppgavetyper,
    optionsFromObjectWithIntl,
    temaValg,
} from './opprett-oppgave-utils';
import { pakrevd } from '../../../felles-komponenter/skjema/validering';
import { getFodselsnummer } from '../../../bootstrap/fnr-util';
import Select from '../../../felles-komponenter/skjema/input/select';
import { opprettOppgaveForBruker } from './opprett-oppgave-reducer';
import {
    hentBehandlendeEnheter,
    resetEnheter,
    selectBehandlendeEnheter,
} from './hent-behandlende-enheter-reducer';
import {
    hentVeiledereForEnhet,
    selectOppgaveVeiledere,
} from './hent-veieldere-for-oppgave-reducer';
import { OpprettOppgaveInnerForm } from './opprett-oppgave-inner-form';
import { moment, toLocalDate } from '../../../utils';
import * as AppPT from '../../../proptypes';

const pakrevdFraDato = pakrevd(
    'opprett-oppgave-form.feilmelding.paakrevd-fradato'
);

const pakrevdTilDato = pakrevd(
    'opprett-oppgave-form.feilmelding.paakrevd-tildato'
);

const pakrevdType = pakrevd('opprett-oppgave-form.feilmelding.paakrevd-type');

const pakrevdEnhet = pakrevd('opprett-oppgave-form.feilmelding.paakrevd-enhet');

function dispatchVelgEnhetDersomBareEn(dispatch, data) {
    if (data.length === 1) {
        const enhetId = data[0].enhetId;
        return dispatch(change(OPPRETT_OPPGAVE_FORM, 'enhetId', enhetId));
    }
    return undefined;
}

function hentVeiledereDersomSammeEnhet(dispatch, props) {
    const enhetId = props.payload;
    if (enhetId && erValgtEnhetLikInnloggetEnhet(enhetId)) {
        return dispatch(hentVeiledereForEnhet(enhetId));
    }
    return undefined;
}

function OpprettOppgaveForm({
    onSubmit,
    hentEnheter,
    errorSummary,
    intl,
    ...rest
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="opprett-oppgave-skjema">
                {errorSummary}
                <Select
                    blankOptionParameters={{ hidden: true }}
                    feltNavn="tema"
                    labelId="innstillinger.modal.opprett-oppgave.tema.tittel"
                    bredde="fullbredde"
                    onChange={v => {
                        hentEnheter(v.target.value);
                    }}
                >
                    {optionsFromObjectWithIntl(temaValg, intl)}
                </Select>
                <OpprettOppgaveInnerForm intl={intl} {...rest} />
            </div>
        </form>
    );
}

OpprettOppgaveForm.propTypes = {
    onSubmit: PT.func.isRequired,
    hentEnheter: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    intl: intlShape.isRequired,
    history: AppPT.history.isRequired,
};

OpprettOppgaveForm.defaultProps = {
    tema: undefined,
};

const OpprettOppgaveReduxForm = validForm({
    form: OPPRETT_OPPGAVE_FORM,
    errorSummaryTitle: (
        <FormattedMessage id="mote-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        beskrivelse: [beskrivelsePakrevd, begrensetBeskrivelseLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        periodeValidering: [],
        type: [pakrevdType],
        enhetId: [pakrevdEnhet],
    },
})(OpprettOppgaveForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(OPPRETT_OPPGAVE_FORM);
    return {
        form: props.formNavn,
        initialValues: {
            fraDato: new Date(),
            tilDato: new Date(),
            prioritet: defaultPrioritet,
            type: Object.keys(oppgavetyper)[0],
            beskrivelse: null,
            veilederId: null,
        },
        veiledere: selectOppgaveVeiledere(state),
        currentFraDato: selector(state, 'fraDato')
            ? moment(selector(state, 'fraDato')).toDate()
            : undefined,
        currentTilDato: selector(state, 'tilDato')
            ? moment(selector(state, 'tilDato')).toDate()
            : undefined,
        valgtEnhet: selector(state, 'enhetId'),
        tema: selector(state, 'tema'),
        behandlendeEnheter: selectBehandlendeEnheter(state),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: props => {
        dispatch(
            opprettOppgaveForBruker({
                ...props,
                fnr: getFodselsnummer(),
                avsenderenhetId: getEnhetFromUrl(),
                fraDato: toLocalDate(props.fraDato),
                tilDato: toLocalDate(props.tilDato),
                veilederId: erValgtEnhetLikInnloggetEnhet(props.enhetId)
                    ? props.veilederId
                    : null,
            })
        )
            .then(() => {
                dispatch(resetEnheter());
                ownProps.history.push('/innstillinger/oppgave/kvittering/');
            })
            .catch(() => {
                dispatch(resetEnheter());
                ownProps.history.push('/innstillinger/oppgave/kvittering/');
            });
    },
    hentEnheter: tema =>
        dispatch(hentBehandlendeEnheter(tema))
            .then(({ data }) => dispatchVelgEnhetDersomBareEn(dispatch, data))
            .then(({ ...props }) =>
                hentVeiledereDersomSammeEnhet(dispatch, props)
            )
            .catch(() => {
                ownProps.history.push('innstillinger/feilkvittering');
            }),
    // eslint-disable-next-line no-confusing-arrow
    hentVeiledere: enhetId =>
        getEnhetFromUrl() === enhetId
            ? dispatch(hentVeiledereForEnhet(enhetId))
            : null,
});

OpprettOppgaveReduxForm.defaultProps = {};

OpprettOppgaveReduxForm.propTypes = {};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        injectIntl(OpprettOppgaveReduxForm)
    )
);
