import PT from 'prop-types';

export const aktivitet = PT.shape({
    tittel: PT.string.isRequired,
    fraDato: PT.string,
    tilDato: PT.string,
    opprettetDato: PT.string,
    endretDato: PT.string,
    lagtInnAv: PT.string,
    detaljer: PT.object,
    beskrivelse: PT.string,
    avtalt: PT.bool,
    tiltaksarrangør: PT.string,
    deltakelsesprosent: PT.number,
    dagerPerUke: PT.number,
});

export const henvendelse = PT.shape({
    dialogId: PT.string.isRequired,
    tekst: PT.string.isRequired,
    avsender: PT.string.isRequired,
    sendt: PT.string.isRequired,
    lest: PT.bool.isRequired,
});

export const dialog = PT.shape({
    id: PT.string.isRequired,
    overskrift: PT.string.isRequired,
    aktivitetId: PT.string,
    lest: PT.bool,
    sisteDato: PT.number,
    sisteTekst: PT.string,
    henvendelser: PT.arrayOf(henvendelse).isRequired,
});

export const etikett = PT.shape({
    id: PT.string,
    type: PT.string,
    visningsTekst: PT.string,
});

export const reducer = PT.shape({
    status: PT.string,
    data: PT.any,
});

export const reducerArray = PT.shape({
    status: PT.string,
    data: PT.arrayOf(PT.object),
});

export const avslutningStatus = PT.shape({
    kanAvslutte: PT.bool,
    underOppfolging: PT.bool,
    harYtelser: PT.bool,
    harTiltak: PT.bool,
    inaktiveringsDato: PT.string,
});

export const situasjon = PT.shape({
    status: PT.string,
    brukerHarAvslatt: PT.bool,
    data: PT.shape({
        fnr: PT.string,
        reservasjonKRR: PT.bool,
        manuell: PT.bool,
        underOppfolging: PT.bool,
        vilkarMaBesvares: PT.bool,
        oppfolgingUtgang: PT.string,
        kanStarteOppfolging: PT.bool,
        avslutningStatus,
        oppfolgingsPerioder: PT.arrayOf(PT.object),
    }),
});

export const vilkar = PT.shape({
    tekst: PT.string,
    hash: PT.string,
    dato: PT.string,
    vilkarstatus: PT.string,
    guid: PT.string,
});

export const mal = PT.shape({
    mal: PT.string,
    endretAv: PT.string,
    dato: PT.string,
});

export const motpart = PT.shape({
    status: PT.string,
    data: PT.shape({
        navn: PT.string,
    }),
});

export const oppfolgingsPeriode = PT.shape({
    id: PT.string,
    fra: PT.string,
    til: PT.string,
});

export const feil = PT.shape({
    is: PT.string,
    type: PT.string.isRequired,
    detaljer: PT.object,
});

export const manuellHistorikk = PT.shape({
    begrunnelse: PT.string,
    dato: PT.string,
    manuell: PT.bool,
    opprettetAvBrukerId: PT.string,
    opprettetAv: PT.string,
});

export const historikk = PT.arrayOf(manuellHistorikk);

export const veileder = PT.shape({
    etternavn: PT.string,
    fornavn: PT.string,
    ident: PT.string,
    navn: PT.string,
});
