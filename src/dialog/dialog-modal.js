import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Dialog from './dialog';
import Dialoger from './dialoger';
import Modal from '../felles-komponenter/modal/modal';
import history from '../history';
import Knappelenke from '../felles-komponenter/utils/knappelenke';
import PilKnapp from '../felles-komponenter/utils/pil-knapp';
import NyHenvendelse from './ny-henvendelse';
import visibleIfHOC from '../hocs/visible-if';
import { section as HideableSection } from '../felles-komponenter/hidden-if/hidden-if';
import VisibleIfTag from '../felles-komponenter/utils/visible-if-tag';
import * as AppPT from '../proptypes';
import Innholdslaster from '../felles-komponenter/utils/innholdslaster';
import { aktivitetRoute } from '../routing';
import { selectMotpartSlice } from '../moduler/motpart/motpart-selector';
import {
    selectAnpassaDialogModalHistoriskVisning,
    selectDialogMedId,
} from '../moduler/dialog/dialog-selector';
import { selectViserHistoriskPeriode } from '../moduler/filtrering/filter/filter-selector';
import DialogFilter from './dialog-filter';

const VisibleDiv = visibleIfHOC(props => <div {...props} />);
const HOYRE_KOLONNE_ID = 'hoyre-kolonne-id';

function nyDialog() {
    history.push('/dialog/ny');
}

function tilbake() {
    history.push('/dialog');
}

function dialogOpprettet(dialog) {
    history.push(`/dialog/${dialog.id}`);
}

function Header({ harNyDialogEllerValgtDialog, motpart, navnPaMotpart, intl }) {
    return (
        <div className="dialog-modal__header">
            <PilKnapp
                visible={harNyDialogEllerValgtDialog}
                className="dialog-modal__tilbake-knapp"
                onClick={tilbake}
                aria-label={intl.formatMessage({ id: 'dialog.modal.tilbake' })}
            />
            <Innholdslaster avhengigheter={[motpart]} spinnerStorrelse="m">
                <Element className="dialog-modal__tittel" tag="h1">
                    <FormattedMessage
                        id="dialog.tittel"
                        values={{ motpart: navnPaMotpart }}
                    />
                </Element>
            </Innholdslaster>
        </div>
    );
}

Header.defaultProps = {
    navnPaMotpart: null,
};

Header.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    motpart: AppPT.reducer.isRequired,
    navnPaMotpart: PT.string,
    intl: intlShape.isRequired,
};

function VenstreKolonne({
    valgtDialog,
    harNyDialog,
    harNyDialogEllerValgtDialog,
    historiskVisning,
}) {
    const className = classNames(
        'dialog-modal__kolonne',
        'dialog-modal__kolonne--dialoger',
        {
            'dialog-modal__kolonne--dialoger-valgt-dialog': harNyDialogEllerValgtDialog,
        }
    );

    return (
        <div className={className}>
            <HideableSection
                className="dialog-modal__ny-dialog"
                hidden={historiskVisning}
            >
                <Knappelenke
                    onClick={nyDialog}
                    disabled={harNyDialog}
                    className="dialog-modal__ny-dialog-knapp"
                >
                    <FormattedMessage id="dialog.modal.ny-dialog" />
                </Knappelenke>
                <DialogFilter />
            </HideableSection>
            <Dialoger
                className="dialog-modal__dialoger"
                valgtDialog={valgtDialog}
            />
        </div>
    );
}

VenstreKolonne.propTypes = {
    valgtDialog: AppPT.dialog,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    historiskVisning: PT.bool.isRequired,
};

VenstreKolonne.defaultProps = {
    valgtDialog: undefined,
};

function HoyreKolonne({
    valgtDialog,
    harValgtDialog,
    harNyDialog,
    harNyDialogEllerValgtDialog,
    valgtAktivitetId,
}) {
    function apneAktivitet() {
        history.push(aktivitetRoute(valgtAktivitetId));
    }

    return (
        <VisibleIfTag
            id={HOYRE_KOLONNE_ID}
            tagName="section"
            visible={harNyDialogEllerValgtDialog}
            className="dialog-modal__kolonne dialog-modal__kolonne--dialog"
        >
            <VisibleDiv visible={harNyDialog}>
                <Undertittel tag="h1" className="endre-dialog__tittel">
                    <FormattedMessage id="dialog.ny-dialog" />
                </Undertittel>
                <NyHenvendelse
                    formNavn="ny-dialog"
                    onComplete={dialogOpprettet}
                />
            </VisibleDiv>
            <VisibleDiv visible={harValgtDialog}>
                <Knappelenke
                    visible={!!valgtAktivitetId}
                    onClick={apneAktivitet}
                    className="endre-dialog__til-aktiviteten"
                >
                    <FormattedMessage id="dialog.modal.til-aktiviteten" />
                </Knappelenke>
                <Dialog
                    dialog={valgtDialog}
                    scrollElementId={HOYRE_KOLONNE_ID}
                />
            </VisibleDiv>
        </VisibleIfTag>
    );
}

HoyreKolonne.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    harNyDialog: PT.bool.isRequired,
    harValgtDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
};

HoyreKolonne.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined,
};

function DialogModalContent(props) {
    return (
        <div className="dialog-modal__wrapper">
            <div className="dialog-modal__innhold">
                <VenstreKolonne {...props} />
                <HoyreKolonne {...props} />
            </div>
        </div>
    );
}

DialogModalContent.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
};

DialogModalContent.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined,
};

function DialogModal(props, intl) {
    const className = classNames('dialog-modal', {
        'dialog-modal--full-bredde': props.harNyDialogEllerValgtDialog,
        'dialog-modal--historisk-visning':
            props.anpassaStorrelseHistoriskVisning,
    });

    return (
        <Modal
            className={className}
            contentClass="aktivitetsplanfs dialog-modal__content"
            header={<Header intl={intl} {...props} />}
            contentLabel="dialog-modal"
        >
            <DialogModalContent {...props} />
        </Modal>
    );
}

DialogModal.defaultProps = {
    valgtAktivitetId: null,
    navnPaMotpart: null,
    valgtDialog: null,
    harNyDialog: null,
};

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    harNyDialog: PT.bool,
    valgtDialog: AppPT.dialog,
    harValgtDialog: PT.bool.isRequired,
    valgtAktivitetId: PT.string,
    motpart: AppPT.motpart.isRequired,
    navnPaMotpart: PT.string,
    historiskVisning: PT.bool.isRequired,
    anpassaStorrelseHistoriskVisning: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const motpart = selectMotpartSlice(state);
    const valgtDialog = selectDialogMedId(state, id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;

    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = selectViserHistoriskPeriode(state);
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        valgtAktivitetId,
        motpart,
        navnPaMotpart: motpart.data.navn,
        historiskVisning,
        anpassaStorrelseHistoriskVisning:
            historiskVisning && selectAnpassaDialogModalHistoriskVisning(state),
    };
};

export default withRouter(connect(mapStateToProps)(injectIntl(DialogModal)));
