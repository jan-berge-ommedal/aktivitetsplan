import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { AlertStripeSuksessSolid } from 'nav-frontend-alertstriper';
import Hovedknapp from 'nav-frontend-knapper/src/hovedknapp';
import moment from 'moment';
import { STATUS } from '../ducks/utils';
import { nyHenvendelse } from '../ducks/dialog';
import Textarea from '../modal/skjema/textarea/textarea';
import Input from '../modal/skjema/input/input';
import visibleIf from '../hocs/visible-if';

const OVERSKRIFT_MAKS_LENGDE = 255;
const TEKST_MAKS_LENGDE = 5000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripeSuksessSolid);

function NyHenvendelseForm({
    handleSubmit,
    harEksisterendeOverskrift,
    oppretter,
    visBrukerInfo,
    skalHaAutofokus,
}) {
    return (
        <form onSubmit={handleSubmit} className="ny-henvendelse-form">
            {harEksisterendeOverskrift ||
                <Input
                    feltNavn="overskrift"
                    labelId="dialog.overskrift-label"
                    disabled={oppretter}
                    autoFocus
                />}
            <Textarea
                labelId="dialog.tekst-label"
                feltNavn="tekst"
                placeholder="Skriv her"
                maxLength={BESKRIVELSE_MAKS_LENGDE}
                disabled={oppretter}
                visTellerFra={1000}
                autoFocus={harEksisterendeOverskrift && skalHaAutofokus}
            />
            <Hovedknapp type="hoved" spinner={oppretter} disabled={oppretter}>
                <FormattedMessage id="dialog.lag-ny-dialog" />
            </Hovedknapp>

            <VisibleAlertStripeSuksessSolid
                style={{ marginTop: '1rem' }}
                visible={visBrukerInfo}
            >
                <FormattedMessage id="dialog.info-til-bruker" />
            </VisibleAlertStripeSuksessSolid>
        </form>
    );
}
NyHenvendelseForm.defaultProps = {
    skalHaAutofokus: false,
};

NyHenvendelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    harEksisterendeOverskrift: PT.bool.isRequired,
    oppretter: PT.bool.isRequired,
    visBrukerInfo: PT.bool.isRequired,
    skalHaAutofokus: PT.bool,
};

const pakrevdOverskrift = rules.minLength(
    0,
    <FormattedMessage id="dialog.ny-henvendelse.overskrift.mangler.feilmelding" />
);
const pakrevdTekst = rules.minLength(
    0,
    <FormattedMessage id="dialog.ny-henvendelse.tekst.mangler.feilmelding" />
);

const begrensetTittelLengde = rules.maxLength(
    OVERSKRIFT_MAKS_LENGDE,
    <FormattedMessage
        id="dialog.ny-henvendelse.overskrift.for-lang.feilmelding"
        values={{ antall_tegn: OVERSKRIFT_MAKS_LENGDE }}
    />
);
const begrensetTekstLengde = rules.maxLength(
    TEKST_MAKS_LENGDE,
    <FormattedMessage
        id="dialog.ny-henvendelse.tekst.for-lang.feilmelding"
        values={{ antall_tegn: TEKST_MAKS_LENGDE }}
    />
);

const NyHenvendelseReduxForm = validForm({
    validate: {
        overskrift: [pakrevdOverskrift, begrensetTittelLengde],
        tekst: [pakrevdTekst, begrensetTekstLengde],
    },
})(NyHenvendelseForm);

const mapStateToProps = (state, props) => {
    const aktivitetId = props.aktivitetId;
    const dialogId = props.dialogId;

    const dialogState = state.data.dialog;
    const dialoger = dialogState.data;
    const aktiviteter = state.data.aktiviteter.data;

    const dialog = dialoger.find(d => d.id === dialogId) || {};
    const aktivitet = aktiviteter.find(a => a.id === aktivitetId) || {};
    const erBruker = state.data.identitet.data.erBruker;

    const overskrift = aktivitet.tittel || dialog.overskrift;
    const sisteDato = dialog.sisteDato;
    return {
        form: props.formNavn,
        initialValues: {
            overskrift,
        },
        harEksisterendeOverskrift: !!overskrift,
        oppretter: dialogState.status !== STATUS.OK,
        visBrukerInfo: !!(
            erBruker &&
            dialogState.sisteHenvendelseData === dialog &&
            moment(sisteDato).add(5, 's').isAfter(moment())
        ),
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (dialogData, dispatch, props) => {
        const nyHenvendelsePromise = nyHenvendelse({
            aktivitetId: props.aktivitetId,
            dialogId: props.dialogId,
            ...dialogData,
        })(dispatch);

        const onComplete = props.onComplete;
        nyHenvendelsePromise.then(action => {
            props.reset();
            if (onComplete) {
                onComplete(action.data);
            }
        });
    },
});

const NyHenvendelseReduxFormConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(NyHenvendelseReduxForm);

function DynamiskNyHenvendelseReduxFormConnected(props) {
    // TODO setter key=formNavn for å tvinge unmount/mount hvis denne endrer seg.
    // Dette burde kanskje kommet ut av boksen fra 'react-redux-form-validation' ?
    return <NyHenvendelseReduxFormConnected key={props.formNavn} {...props} />;
}

DynamiskNyHenvendelseReduxFormConnected.propTypes = {
    formNavn: PT.string.isRequired,
};

export default DynamiskNyHenvendelseReduxFormConnected;
