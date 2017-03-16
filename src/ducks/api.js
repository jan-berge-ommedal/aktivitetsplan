import {API_BASE_URL, AKTIVITET_PROXY_BASE_URL, SITUASJON_PROXY_BASE_URL} from '~config';
import { fetchToJson, postAsJson, putAsJson } from './../ducks/utils';

export function hentLedetekster() { // eslint-disable-line  import/prefer-default-export
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentOppfolgingStatus() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/oppfolgingstatus`);
}

export function godtaVilkar() {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/vilkar/godta`);
}

export function hentVilkar() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/vilkar`);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet`);
}

export function hentEndringsloggTilAktivitet(aktivitet) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/endringslogg`);
}

export function lagNyAktivitet(aktivitet) {
    return postAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/ny`, aktivitet);
}
export function oppdaterAktivitet(aktivitet) {
    return putAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);
}

export function oppdaterAktivitetStatus(aktivitet, status) {
    return putAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/status/${status}`);
}

export function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/etiketter`);
}

export function slettAktivitet(aktivitet) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`, { method: 'delete' });
}
