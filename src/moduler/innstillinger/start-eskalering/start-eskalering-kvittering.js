import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Modal from '../../../felles-komponenter/modal/modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import {
    selectGjeldendeEskaleringsVarsel,
    selectOppfolgingStatus,
} from '../../oppfolging-status/oppfolging-selector';
import {
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import { formaterDatoKortManed } from '../../../utils';

function StartEskaleringKvittering({ navn, dato, avhengigheter }) {
    return (
        <Modal contentLabel="instillinger-modal" contentClass="innstillinger">
            <Innholdslaster avhengigheter={avhengigheter}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.start-eskalering.overskrift" />
                        </Systemtittel>
                    </div>
                    <AlertStripeSuksess className="blokk-m">
                        <FormattedMessage
                            id="innstillinger.modal.start-eskalering.kvittering"
                            values={{ dato: formaterDatoKortManed(dato) }}
                        />
                    </AlertStripeSuksess>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StartEskaleringKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    navn: PT.string.isRequired,
    dato: PT.string.isRequired,
};

const mapStateToProps = state => {
    const eskaleringsVarsel = selectGjeldendeEskaleringsVarsel(state);
    return {
        avhengigheter: [
            selectMotpartStatus(state),
            selectOppfolgingStatus(state),
        ],
        navn: selectNavnPaMotpart(state),
        dato: eskaleringsVarsel && eskaleringsVarsel.opprettetDato,
    };
};

export default connect(mapStateToProps)(StartEskaleringKvittering);
