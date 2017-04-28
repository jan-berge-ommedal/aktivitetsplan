import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Knapp } from 'nav-react-design/dist/knapp';
import { Hovedknapp } from 'nav-frontend-knapper';
import { formValueSelector } from 'redux-form';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import UnderelementerForAktivitet from './underelementer-for-aktivitet';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { slettAktivitet, flyttAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import {TILLAT_SLETTING} from '~config' // eslint-disable-line
import BekreftSlettVisning from './bekreftslettvisning';
import OppdaterAktivitetStatus from './oppdater-aktivitet-status';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import BegrunnelseBoks from './begrunnelse-boks';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';

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
        const valgtAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === id);

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

        const onLagre = (aktivitet) => {
            if (aktivitet.status === this.props.valgtStatus) {
                return history.push('/');
            } else if (this.props.valgtStatus === STATUS_FULLFOERT && aktivitet.avtalt) {
                history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
            } else if (this.props.valgtStatus === STATUS_AVBRUTT && aktivitet.avtalt) {
                history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
            } else {
                this.props.doFlyttAktivitet(aktivitet, this.props.valgtStatus);
                history.push('/');
            }
            return null;
        };

        const etiketter = valgtAktivitet.avtalt ? valgtAktivitet.tagger.concat({ tag: 'Avtalt med NAV', type: 'avtalt' }) : valgtAktivitet.tagger;

        return (
            <ModalHeader
                normalTekstId="aktivitetvisning.header"
                normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
                className="side-innhold"
                aria-labelledby="modal-aktivitetsvisning-header"
            >
                <ModalContainer>
                    <div className="aktivitetvisning">

                        <BegrunnelseBoks
                            begrunnelse={valgtAktivitet.avsluttetKommentar}
                            visible={visBegrunnelse}
                        />

                        <Sidetittel id="modal-aktivitetsvisning-header">
                            {valgtAktivitet.tittel}
                        </Sidetittel>
                        <AktivitetEtiketter etiketter={etiketter} className="aktivitetvisning__etikett" />
                        <AktivitetsDetaljer
                            className="aktivitetvisning__detaljer"
                            valgtAktivitet={valgtAktivitet}
                        />
                        <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />

                        <hr className="aktivitetvisning__delelinje" />

                        <OppdaterAktivitetStatus status={valgtAktivitet.status} tagger={valgtAktivitet.tagger} />

                        <hr className="aktivitetvisning__delelinje" />

                        <UnderelementerForAktivitet aktivitet={valgtAktivitet} />
                    </div>
                </ModalContainer>

                <ModalFooter>
                    {/* TODO: tekster*/}
                    <Hovedknapp
                        className="aktivitetvisning__lagre--knapp"
                        spinner={valgtAktivitet.laster}
                        autoDisableVedSpinner
                        onClick={() => onLagre(valgtAktivitet)}
                    >
                        Lagre
                    </Hovedknapp>

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
    aktiviteter: PT.arrayOf(AppPT.aktivitet),
    valgtStatus: PT.string,
    doFlyttAktivitet: PT.func.isRequired
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter.data,
    oppfolgingStatus: state.data.oppfolgingStatus.data,
    valgtStatus: formValueSelector('oppdaterStatus-form')(state, 'aktivitetstatus')
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch),
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
