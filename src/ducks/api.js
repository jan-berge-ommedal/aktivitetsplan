import {
    API_BASE_URL,
    DIALOG_BASE_URL,
    AKTIVITET_PROXY_BASE_URL,
    SITUASJON_PROXY_BASE_URL,
    PERSON_BASE_URL,
    VEILEDER_BASE_URL,
} from '~config'; // eslint-disable-line
import { fetchToJson, postAsJson, putAsJson } from './../ducks/utils';

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export function hentDialog() {
    return fetchToJson(`${DIALOG_BASE_URL}/dialog`);
}

export function nyHenvendelse(henvendelse) {
    return postAsJson(`${DIALOG_BASE_URL}/dialog`, henvendelse);
}

export function markerDialogSomLest(dialogId) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/les`);
}

export function oppdaterDialog(dialog) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialog.id}`, dialog);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet`);
}

export function hentAktivitet(aktivitetId) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitetId}`);
}

export function hentArenaAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/arena`);
}

export function hentVersjonerTilAktivitet(aktivitet) {
    return fetchToJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`
    );
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

export function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/etiketter`);
}

export function slettAktivitet(aktivitet) {
    return fetchToJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`,
        { method: 'delete' }
    );
}
