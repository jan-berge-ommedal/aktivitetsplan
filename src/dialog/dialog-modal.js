import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import classNames from 'classnames';
import Dialog from './dialog';
import Dialoger from './dialoger';
import Modal from '../modal/modal';
import Hovedside from '../sider/hovedside/hovedside';
import history from '../history';
import Knappelenke from '../felles-komponenter/utils/knappelenke';
import PilKnapp from '../felles-komponenter/utils/pil-knapp';
import NyHenvendelse from './ny-henvendelse';
import visibleIfHOC from '../hocs/visible-if';
import './dialog-modal.less';
import * as AppPT from '../proptypes';

const animationTime = 300;
const VisibleDiv = visibleIfHOC((props) => <div {...props} />);


function nyDialog() {
    history.push('/dialog/ny');
}

function tilbake() {
    history.push('/dialog');
}

function dialogOpprettet(dialog) {
    history.push(`/dialog/${dialog.id}`);
}


function Header({ navigerTil, harNyDialogEllerValgtDialog }) {
    return (
        <div className="dialog-modal__header">
            <PilKnapp visible={harNyDialogEllerValgtDialog} className="dialog-modal__tilbake-knapp" onClick={tilbake} />
            <Undertittel className="dialog-modal__tittel">
                <FormattedMessage id="dialog.tittel" />
            </Undertittel>
            <Lukknapp overstHjorne onClick={() => navigerTil('/')}>
                <FormattedMessage id="dialog.modal.lukk-dialog" />
            </Lukknapp>
        </div>
    );
}

Header.propTypes = {
    navigerTil: PT.func.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

function VenstreKolonne({ valgtDialog, harNyDialog, harNyDialogEllerValgtDialog }) {
    const className = classNames(
        'dialog-modal__kolonne',
        'dialog-modal__kolonne--dialoger', {
            'dialog-modal__kolonne--dialoger-valgt-dialog': harNyDialogEllerValgtDialog
        });

    return (
        <div className={className}>
            <section className="dialog-modal__ny-dialog">
                <Knapp
                    onClick={nyDialog}
                    disabled={harNyDialog}
                    className="dialog-modal__ny-dialog-knapp"
                >
                    <FormattedMessage id="dialog.modal.ny-dialog" />
                </Knapp>
            </section>
            <Dialoger className="dialog-modal__dialoger" valgtDialog={valgtDialog} />
        </div>
    );
}


VenstreKolonne.propTypes = {
    valgtDialog: AppPT.dialog,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

VenstreKolonne.defaultProps = {
    valgtDialog: undefined
};


function HoyreKolonne({ navigerTil, valgtDialog, harValgtDialog, harNyDialog, harNyDialogEllerValgtDialog, valgtAktivitetId }) {
    function apneAktivitet() {
        navigerTil(`/aktivitet/aktivitet/${valgtAktivitetId}`);
    }

    return (
        <VisibleDiv visible={harNyDialogEllerValgtDialog} className="dialog-modal__kolonne dialog-modal__kolonne--dialog">
            <VisibleDiv visible={harNyDialog}>
                <Undertittel>
                    <FormattedMessage id="dialog.ny-dialog" />
                </Undertittel>
                <NyHenvendelse formNavn="ny-dialog" onComplete={dialogOpprettet} />
            </VisibleDiv>
            <VisibleDiv visible={harValgtDialog}>
                <Knappelenke visible={!!valgtAktivitetId} onClick={apneAktivitet}>
                    <FormattedMessage id="dialog.modal.til-aktiviteten" />
                </Knappelenke>
                <Dialog dialog={valgtDialog} />
            </VisibleDiv>
        </VisibleDiv>
    );
}

HoyreKolonne.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    navigerTil: PT.func.isRequired,
    harNyDialog: PT.bool.isRequired,
    harValgtDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

HoyreKolonne.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined
};

function DialogModalContent(props) {
    return (
        <div className="dialog-modal__wrapper">
            <Header {...props} />
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
    navigerTil: PT.func.isRequired,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

DialogModalContent.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined
};

class DialogModal extends Component { // eslint-disable-line react/no-multi-comp

    constructor() {
        super();
        this.navigerTil = this.navigerTil.bind(this);
    }

    componentDidMount() {
        this.setState({ // eslint-disable-line react/no-did-mount-set-state
            vis: true
        });
    }

    navigerTil(sti) {
        this.setState({
            vis: false
        });
        setTimeout(() => {
            history.push(sti);
        }, animationTime);
    }

    render() {
        const state = this.state || {};
        const { harNyDialogEllerValgtDialog } = this.props;
        const className = classNames('dialog-modal', {
            'dialog-modal--vis': state.vis,
            'dialog-modal--full-bredde': harNyDialogEllerValgtDialog
        });

        function lukkModal() {
            this.navigerTil('/');
        }

        return (
            <div>
                <Hovedside />
                <Modal className={className} closeButton={false} onRequestClose={lukkModal} isOpen>
                    <DialogModalContent navigerTil={this.navigerTil} {...this.props} />
                </Modal>
            </div>
        );
    }
}

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

const mapStateToProps = (state, props) => {
    const { routeParams } = props;
    const { id } = routeParams;
    const dialoger = state.data.dialog.data;
    const valgtDialog = dialoger.find((d) => d.id === id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;

    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        valgtAktivitetId
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
