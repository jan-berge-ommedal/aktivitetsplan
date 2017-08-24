import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
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
import { SORTER_DIALOGER } from '../ducks/dialog';

const VisibleDiv = visibleIfHOC(props => <div {...props} />);

function nyDialog() {
    history.push('/dialog/ny');
}

function tilbake() {
    history.push('/dialog');
}

function dialogOpprettet(dialog) {
    history.push(`/dialog/${dialog.id}`);
}

function Header({ harNyDialogEllerValgtDialog, motpart, navnPaMotpart }) {
    return (
        <div className="dialog-modal__header">
            <PilKnapp
                visible={harNyDialogEllerValgtDialog}
                className="dialog-modal__tilbake-knapp"
                onClick={tilbake}
            />
            <Innholdslaster avhengigheter={[motpart]} spinnerStorrelse="m">
                <Undertittel className="dialog-modal__tittel" tag="h1">
                    <FormattedMessage
                        id="dialog.tittel"
                        values={{ motpart: navnPaMotpart }}
                    />
                </Undertittel>
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
            tagName="section"
            visible={harNyDialogEllerValgtDialog}
            className="dialog-modal__kolonne dialog-modal__kolonne--dialog"
        >
            <VisibleDiv visible={harNyDialog}>
                <Undertittel tag="h1">
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
                >
                    <FormattedMessage id="dialog.modal.til-aktiviteten" />
                </Knappelenke>
                <Dialog dialog={valgtDialog} />
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

class DialogModal extends Component {
    componentDidMount() {
        this.props.sorterDialoger();
    }

    render() {
        const props = this.props;

        const { harNyDialogEllerValgtDialog } = props;
        const className = classNames('dialog-modal', {
            'dialog-modal--full-bredde': harNyDialogEllerValgtDialog,
        });

        return (
            <Modal
                className={className}
                contentClass="aktivitetsplanfs dialog-modal__content"
                header={<Header {...props} />}
            >
                <DialogModalContent {...props} />
            </Modal>
        );
    }
}

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    sorterDialoger: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const stateData = state.data;
    const motpart = stateData.motpart;
    const dialoger = stateData.dialog.data;
    const valgtDialog = dialoger.find(d => d.id === id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;

    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = !!stateData.filter.historiskPeriode;
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        valgtAktivitetId,
        motpart,
        navnPaMotpart: motpart.data.navn,
        historiskVisning,
    };
};

const mapDispatchToProps = dispatch => ({
    sorterDialoger: () => {
        dispatch(SORTER_DIALOGER);
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DialogModal)
);
