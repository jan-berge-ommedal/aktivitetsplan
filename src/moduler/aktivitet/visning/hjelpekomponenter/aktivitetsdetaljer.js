import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, EtikettLiten } from 'nav-frontend-typografi';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { Link } from 'react-router';
import * as AppPT from '../../../../proptypes';
import {
    formaterDatoKortManed,
    formaterDatoKortManedTid,
    formaterTid,
} from '../../../../utils';
import {
    EGEN_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    BEHANDLING_AKTIVITET_TYPE,
} from '../../../../constant';
import DetaljFelt from './detalj-felt';
import { endreAktivitetRoute } from '../../../../routing';
import AktivitetBeskrivelse from './aktivitetsbeskrivelse';

function RedigerLink({ id, felt }) {
    return (
        <Link to={endreAktivitetRoute(id)}>
            <FormattedMessage
                id="aktivitetsdetaljer.legg-til-felt"
                values={{ felt }}
            />
        </Link>
    );
}

RedigerLink.propTypes = {
    id: PT.string.isRequired,
    felt: PT.string.isRequired,
};

function Informasjonsfelt({ tittel, innhold }) {
    return (
        <DetaljFelt tittel={tittel} visible={innhold !== null}>
            <Normaltekst className="detaljfelt__tekst">
                {innhold}
            </Normaltekst>
        </DetaljFelt>
    );
}

Informasjonsfelt.propTypes = {
    tittel: PT.node.isRequired,
    innhold: PT.string,
};

Informasjonsfelt.defaultProps = {
    innhold: undefined,
};

function Aktivitetsdetaljer({ valgtAktivitet, className }) {
    const {
        type: aktivitetstype,
        lenke,
        arbeidsgiver,
        arbeidssted,
        kontaktperson,
        hensikt,
        arrangoer,
        deltakelseProsent,
        antallDagerPerUke,
        gruppeAktivitetSted,
        gruppeAktivitetStatus,
        moeteplanListe,
        oppfolging,
        antallStillingerSokes,
        avtaleOppfolging,
        jobbStatus,
        ansettelsesforhold,
        arbeidstid,
        behandlingType,
        behandlingSted,
        effekt,
        behandlingOppfolging,
        beskrivelse,
    } = valgtAktivitet;

    const fraDato = formaterDatoKortManed(valgtAktivitet.fraDato);
    const tilDato = formaterDatoKortManed(valgtAktivitet.tilDato);

    const fraDatoTekst = aktivitet => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return (
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.egen" />
                );
            case STILLING_AKTIVITET_TYPE:
                return (
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.stilling" />
                );
            default:
                return (
                    <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />
                );
        }
    };

    const tilDatoTekst = aktivitet => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return (
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.egen" />
                );
            case STILLING_AKTIVITET_TYPE:
                return (
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.stilling" />
                );
            default:
                return (
                    <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.default" />
                );
        }
    };

    const httpRegex = /^(https?):\/\/.*$/;

    const lenkeKomponent = () =>
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={lenke != null}
        >
            <Link
                href={
                    lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`
                }
                className="detaljfelt__lenke"
                target="_blank"
            >
                {lenke}
            </Link>
        </DetaljFelt>;

    const ledigStillingFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato}
        />,
        <Informasjonsfelt
            key="arbeidsgiver"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.arbeidsgiver-label" />
            }
            innhold={arbeidsgiver}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato}
        />,
        <Informasjonsfelt
            key="arbeidssted"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.arbeidssted-label" />
            }
            innhold={arbeidssted}
        />,
        lenkeKomponent(),
        <Informasjonsfelt
            key="kontaktperson"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.kontaktperson-label" />
            }
            innhold={kontaktperson}
        />,
    ];

    const egenStillingFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato}
        />,
        lenkeKomponent(),
        <Informasjonsfelt
            key="hensikt"
            tittel={<FormattedMessage id="aktivitetdetaljer.hensikt-label" />}
            innhold={hensikt}
        />,

        <Informasjonsfelt
            key="oppfolging"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.oppfolging-label" />
            }
            innhold={oppfolging}
        />,
    ];

    const tiltakFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato || 'Dato ikke satt'}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato || 'Dato ikke satt'}
        />,
        <Informasjonsfelt
            key="arrangoer"
            tittel={<FormattedMessage id="aktivitetdetaljer.aarrangor-label" />}
            innhold={arrangoer}
        />,
        <Informasjonsfelt
            key="deltakelsesprosent"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.deltakelsesprosent-label" />
            }
            innhold={deltakelseProsent && `${deltakelseProsent}%`}
        />,
        <Informasjonsfelt
            key="dagerPerUke"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.antall-dager-per-uke-label" />
            }
            innhold={antallDagerPerUke && `${antallDagerPerUke}`}
        />,
    ];

    const gruppeFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato || 'Dato ikke satt'}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato || 'Dato ikke satt'}
        />,
        <Informasjonsfelt
            key="gruppeAktivitetSted"
            tittel={<FormattedMessage id="aktivitetdetaljer.sted-label" />}
            innhold={gruppeAktivitetSted}
        />,
        <Informasjonsfelt
            key="gruppeAktivitetStatus"
            tittel={<FormattedMessage id="aktivitetdetaljer.status-label" />}
            innhold={gruppeAktivitetStatus}
        />,
        <section key="moteplan" className="aktivitetsbeskrivelse">
            <EtikettLiten className="aktivitetsbeskrivelse__tittel">
                <FormattedMessage id="aktivitetdetaljer.moteplan-label" />
            </EtikettLiten>
            {moeteplanListe.map(mote =>
                <Normaltekst key={mote.startDato} className="detaljfelt__tekst">
                    {formaterDatoKortManedTid(mote.startDato)} -{' '}
                    {formaterTid(mote.sluttDato)} på {mote.sted}
                </Normaltekst>
            )}
        </section>,
    ];

    const utdanningFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato || 'Dato ikke satt'}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato || 'Dato ikke satt'}
        />,
    ];

    const sokeavtaleFelter = () => {
        const oppfolgingSection =
            avtaleOppfolging &&
            <section key="avtaleOppfolging" className="aktivitetsbeskrivelse">
                <EtikettLiten className="aktivitetsbeskrivelse__tittel">
                    <FormattedMessage id="aktivitetdetaljer.avtale-oppfolging-label" />
                </EtikettLiten>
                <Tekstomrade className="aktivitetsbeskrivelse__tekst">
                    {avtaleOppfolging}
                </Tekstomrade>
            </section>;
        return [
            <Informasjonsfelt
                key="fradato"
                tittel={fraDatoTekst(aktivitetstype)}
                innhold={fraDato}
            />,
            <Informasjonsfelt
                key="tildato"
                tittel={tilDatoTekst(aktivitetstype)}
                innhold={tilDato}
            />,
            <Informasjonsfelt
                key="antallStillinger"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.antall-label" />
                }
                innhold={`${antallStillingerSokes}`}
            />,
            oppfolgingSection,
        ];
    };

    const iJobbFelter = () => [
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato}
        />,
        <Informasjonsfelt
            key="jobbstatus"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.jobbStatus-label" />
            }
            innhold={
                <FormattedMessage
                    id={`aktivitetdetaljer.jobbStatus-${jobbStatus}`}
                />
            }
        />,
        <Informasjonsfelt
            key="ansettelsesforhold"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.ansettelsesforhold-label" />
            }
            innhold={ansettelsesforhold}
        />,
        <Informasjonsfelt
            key="arbeidstid"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.arbeidstid-label" />
            }
            innhold={arbeidstid}
        />,
    ];

    const behandlingFelter = () => [
        <Informasjonsfelt
            key="behandlingtype"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.behandling-type-label" />
            }
            innhold={behandlingType}
        />,
        <Informasjonsfelt
            key="behandlingsted"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.behandling-sted-label" />
            }
            innhold={behandlingSted}
        />,
        <Informasjonsfelt
            key="fradato"
            tittel={fraDatoTekst(aktivitetstype)}
            innhold={fraDato}
        />,
        <Informasjonsfelt
            key="tildato"
            tittel={tilDatoTekst(aktivitetstype)}
            innhold={tilDato}
        />,
        <Informasjonsfelt
            key="effekt"
            tittel={<FormattedMessage id="aktivitetdetaljer.effekt-label" />}
            innhold={effekt}
        />,
        <Informasjonsfelt
            key="behandlingOppfolging"
            tittel={
                <FormattedMessage id="aktivitetdetaljer.behandling-oppfolging-label" />
            }
            innhold={behandlingOppfolging}
        />,
    ];

    const map = {
        [EGEN_AKTIVITET_TYPE]: egenStillingFelter,
        [STILLING_AKTIVITET_TYPE]: ledigStillingFelter,
        [TILTAK_AKTIVITET_TYPE]: tiltakFelter,
        [GRUPPE_AKTIVITET_TYPE]: gruppeFelter,
        [UTDANNING_AKTIVITET_TYPE]: utdanningFelter,
        [SOKEAVTALE_AKTIVITET_TYPE]: sokeavtaleFelter,
        [IJOBB_AKTIVITET_TYPE]: iJobbFelter,
        [BEHANDLING_AKTIVITET_TYPE]: behandlingFelter,
    };

    const cls = clsName => classNames(clsName, 'aktivitetsdetaljer');
    return (
        <section className={cls(className)}>
            {map[aktivitetstype]()}
            <AktivitetBeskrivelse beskrivelse={beskrivelse} />
        </section>
    );
}

Aktivitetsdetaljer.propTypes = {
    className: PT.string,
    valgtAktivitet: AppPT.aktivitet.isRequired,
};

Aktivitetsdetaljer.defaultProps = {
    className: undefined,
};

export default Aktivitetsdetaljer;
