import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import UnderelementerForAktivitet from './underelementer-for-aktivitet';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { slettAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import {TILLAT_SLETTING} from '~config' // eslint-disable-line
import BekreftSlettVisning from './bekreftslettvisning';
import AvtaltContainer from './avtalt-container';
import './aktivitetvisning.less';
import BegrunnelseBoks from './begrunnelse-boks';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import VisibleIfDiv from '../../felles-komponenter/utils/visibleIfDiv';

class Aktivitetvisning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftSletting: false,
            settAutoFocusSlett: false
        };
    }

    render() {
        const { params, aktiviteter, doSlettAktivitet, oppfolgingStatus } = this.props;
        const { id } = params;
        const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === id);

        if (!valgtAktivitet) {
            return null;
        } else if (this.state.visBekreftSletting) {
            const slettAction = () => {
                doSlettAktivitet(valgtAktivitet);
                history.push('/');
            };

            return (
                <BekreftSlettVisning
                    slettAction={slettAction}
                    avbrytAction={() => this.setState({
                        visBekreftSletting: false,
                        settAutoFocusSlett: true })}
                />
            );
        }
        const tillatSletting = TILLAT_SLETTING && (
                !oppfolgingStatus.underOppfolging ||
                moment(oppfolgingStatus.oppfolgingUtgang).isAfter(valgtAktivitet.opprettetDato)
            );

        const visBegrunnelse = valgtAktivitet.avtalt === true &&
            (valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT);

        return (
            <ModalHeader
                normalTekstId="aktivitetvisning.header"
                normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
                className="side-innhold"
                aria-labelledby="modal-aktivitetsvisning-header"
            >
                <ModalContainer>
                    <div className="aktivitetvisning">
                        <VisibleIfDiv visible={visBegrunnelse} className="aktivitetvisning__underseksjon">
                            <BegrunnelseBoks
                                begrunnelse={valgtAktivitet.avsluttetKommentar}
                                visible={visBegrunnelse}
                            />
                        </VisibleIfDiv>
                        <div className="aktivitetvisning__underseksjon">
                            <Sidetittel id="modal-aktivitetsvisning-header">
                                {valgtAktivitet.tittel}
                            </Sidetittel>
                            <AktivitetEtiketter etiketter={valgtAktivitet.tagger} className="aktivitetvisning__etikett" />
                            <AktivitetsDetaljer
                                className="aktivitetvisning__detaljer"
                                valgtAktivitet={valgtAktivitet}
                            />
                            <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />
                        </div>
                        <hr className="aktivitetvisning__delelinje" />
                        <div className="aktivitetvisning__underseksjon">
                            <AvtaltContainer aktivitet={valgtAktivitet} />
                        </div>
                        <hr className="aktivitetvisning__delelinje" />
                        <div className="aktivitetvisning__underseksjon">
                            <UnderelementerForAktivitet aktivitet={valgtAktivitet} />
                        </div>
                    </div>
                </ModalContainer>

                <ModalFooter>
                    {/* TODO: tekster*/}
                    {tillatSletting &&
                    <Knapp
                        onClick={() => this.setState({ visBekreftSletting: true, settAutoFocusSlett: false })}
                        className="knapp-liten modal-footer__knapp" autoFocus={this.state.settAutoFocusSlett}
                    >
                        Slett
                    </Knapp>}
                </ModalFooter>
            </ModalHeader>
        );
    }
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    oppfolgingStatus: AppPT.oppfolgingStatus,
    aktiviteter: PT.shape({
        data: PT.arrayOf(AppPT.aktivitet)
    })
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter,
    oppfolgingStatus: state.data.oppfolgingStatus.data,
    dialoger: state.data.dialog.data
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
