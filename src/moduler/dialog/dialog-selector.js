import { dialogFilter } from '../filtrering/filter/filter-utils';

export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogReducer(state).status;
}

export function selectEskaleringsFilter(state) {
    return selectDialogReducer(state).esklaringsFilter;
}

export function selectEskaleringsDialoger(state) {
    return selectDialogReducer(state).data.filter(
        dialog => dialog.egenskaper.indexOf('ESKALERINGSVARSEL') > -1
    );
}

export function selectDialoger(state) {
    if (selectEskaleringsFilter(state)) {
        return selectEskaleringsDialoger(state);
    }
    return selectDialogReducer(state).data;
}

export function selectAktuellaDialoger(state) {
    return selectDialoger(state).filter(d => dialogFilter(d, state));
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    return selectDialoger(state).find(d => d.aktivitetId === aktivitetId);
}

export function selectHarUbehandledeDialoger(state) {
    const data = selectDialoger(state);
    return (
        data.filter(
            dialog =>
                dialog.historisk === false &&
                (dialog.ferdigBehandlet === false || dialog.venterPaSvar)
        ).length > 0
    );
}
