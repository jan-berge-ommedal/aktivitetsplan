import {
    API_BASE_URL,
    DIALOG_BASE_URL,
    AKTIVITET_PROXY_BASE_URL,
    SITUASJON_PROXY_BASE_URL,
    PERSON_BASE_URL,
    VEILEDER_BASE_URL,
} from '~config'; // eslint-disable-line
import { fetchToJson, postAsJson, putAsJson } from './../../ducks/utils';

export function hentAktivitet(aktivitetId) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitetId}`);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet`);
}

export function lagNyAktivitet(aktivitet) {
    return postAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/ny`, aktivitet);
}
export function oppdaterAktivitet(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`,
        aktivitet
    );
}

export function oppdaterAktivitetStatus(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/status`,
        aktivitet
    );
}

export function oppdaterAktivitetEtikett(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/etikett`,
        aktivitet
    );
}

export function slettAktivitet(aktivitet) {
    return fetchToJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`,
        { method: 'delete' }
    );
}
