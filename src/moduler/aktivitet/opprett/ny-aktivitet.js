import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Bilde from 'nav-react-design/dist/bilde';
import { hentIdentitet } from '../../../ducks/identitet';
import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import leggTilAktivitetSvg from '../../../img/legg-til-aktivitet-illustrasjon.svg';
import StandardModal from '../../../felles-komponenter/modal/modal-standard';

class NyAktivitet extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const { erVeileder } = this.props;
        return (
            <StandardModal name="nyAktivitetModal">
                <ModalHeader className="ny-aktivitet-modal side-innhold">
                    <div className="ny-aktivitet-modal__header">
                        <Bilde
                            className="ny-aktivitet-modal__bilde"
                            src={leggTilAktivitetSvg}
                            alt="Dekorativ illustrajon"
                        />
                        <Innholdstittel className="ny-aktivitet-tittel">
                            <FormattedMessage id="ny-aktivitet-modal.tittel" />
                        </Innholdstittel>
                    </div>
                    <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                        <Lenkepanel href="/aktivitet/ny/stilling">
                            <FormattedMessage id="ny-aktivitet-modal.ledig-stilling" />
                        </Lenkepanel>
                        <Lenkepanel href="/aktivitet/ny/egen">
                            <FormattedMessage id="ny-aktivitet-modal.egen-aktivitet" />
                        </Lenkepanel>
                        {erVeileder &&
                            <Lenkepanel href="/aktivitet/ny/sokeavtale">
                                <FormattedMessage id="ny-aktivitet-modal.sokeavtale-aktivitet" />
                            </Lenkepanel>}
                        {erVeileder &&
                            <Lenkepanel href="/aktivitet/ny/behandling">
                                <FormattedMessage id="ny-aktivitet-modal.medisinsk-behandling" />
                            </Lenkepanel>}
                    </div>
                </ModalHeader>
            </StandardModal>
        );
    }
}

NyAktivitet.propTypes = {
    doHentIdentitet: PT.func.isRequired,
    erVeileder: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erVeileder: state.data.identitet.data.erVeileder,
});

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitet);
