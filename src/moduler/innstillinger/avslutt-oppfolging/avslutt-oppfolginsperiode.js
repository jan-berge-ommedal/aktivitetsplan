import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { moment } from '../../../utils';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import BegrunnelseForm from '../begrunnelse-form';
import { lagreBegrunnelse } from '../innstillinger-reducer';
import InnstillingerModal from '../innstillinger-modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import hiddenIfHOC from '../../../felles-komponenter/hidden-if/hidden-if';
import AlertstripeListe from '../../../felles-komponenter/alertstripe-liste';
import {
    selectDialogStatus,
    selectHarUbehandledeDialoger,
} from '../../dialog/dialog-selector';
import {
    selectInaktiveringsDato,
    selectInnstillingerStatus,
    selectAvslutningStatus,
} from '../innstillinger-selector';
import * as AppPT from '../../../proptypes';

export const AVSLUTT_FORM_NAME = 'avslutt-oppfolging-form';
const HiddenIfNormaltekst = hiddenIfHOC(Normaltekst);

function lagAlertstripelisteConfig({
    harUbehandledeDialoger,
    harAktiveYtelser,
}) {
    return {
        'innstillinger.modal.avslutt.ubehandlede-dialoger.alert-melding': harUbehandledeDialoger,
        'innstillinger.prosess.avslutt-oppfolging.feil.aktive-ytelser': harAktiveYtelser,
    };
}

function AvsluttOppfolgingperiode({
    onSubmit,
    harAktiveYtelser,
    datoErInnenfor28dager,
    avhengigheter,
    harUbehandledeDialoger,
    history,
}) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={avhengigheter}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <HiddenIfNormaltekst
                                hidden={!datoErInnenfor28dager}
                            >
                                <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse.innenfor-28-dager" />
                            </HiddenIfNormaltekst>
                            <HiddenIfNormaltekst hidden={datoErInnenfor28dager}>
                                <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse" />
                            </HiddenIfNormaltekst>
                        </div>
                        <AlertstripeListe
                            nopadding
                            nobullets={false}
                            className="blokk-xxs"
                            config={lagAlertstripelisteConfig({
                                harUbehandledeDialoger,
                                harAktiveYtelser,
                            })}
                        >
                            <FormattedMessage id="innstillinger.prosess.avslutt-oppfolging.bekreft.forklaring" />
                        </AlertstripeListe>
                        <BegrunnelseForm
                            labelId="innstillinger.modal.avslutt.oppfolging.begrunnelse"
                            pakrevdFeilmelding="avslutt.oppfolging.begrunnelse.for-kort"
                            formNavn={AVSLUTT_FORM_NAME}
                            onSubmit={onSubmit}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp formNavn={AVSLUTT_FORM_NAME}>
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avslutt" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={AVSLUTT_FORM_NAME}
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

AvsluttOppfolgingperiode.propTypes = {
    onSubmit: PT.func.isRequired,
    harAktiveYtelser: PT.bool.isRequired,
    datoErInnenfor28dager: PT.bool.isRequired,
    harUbehandledeDialoger: PT.bool.isRequired,
    avhengigheter: PT.arrayOf(AppPT.status).isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: form => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        return props.history.push('/innstillinger/avslutt/bekreft');
    },
});

const mapStateToProps = state => {
    const innstillingerStatus = selectInnstillingerStatus(state);
    const dialogStatus = selectDialogStatus(state);
    const inaktiveringsDato = selectInaktiveringsDato(state);
    const avslutningStatus = selectAvslutningStatus(state);

    const harAktiveYtelser = avslutningStatus.harYtelser;
    const for28dagerSiden = moment().subtract(28, 'day').toISOString();
    const datoErInnenfor28dager = inaktiveringsDato > for28dagerSiden;

    return {
        harAktiveYtelser,
        datoErInnenfor28dager,
        harUbehandledeDialoger: selectHarUbehandledeDialoger(state),
        avhengigheter: [innstillingerStatus, dialogStatus],
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AvsluttOppfolgingperiode
);
