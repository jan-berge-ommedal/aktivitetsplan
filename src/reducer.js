import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arbeidslisteReducer from './moduler/arbeidsliste/arbeidsliste-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import behandlendeEnheterReducer from './moduler/innstillinger/opprett-oppgave/hent-behandlende-enheter-reducer';
import brukerReducer from './moduler/bruker/bruker-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import dialogViewReducer from './moduler/dialog/dialog-view-reducer';
import etiketterReducer from './felles-komponenter/aktivitet-etikett/aktivitet-etiketter-reducer';
import featureReducer from './ducks/feature-reducer';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import oppgaveHistorikkReducer from './moduler/innstillinger/historikk/oppgave-historikk-reducer';
import oppfolgingHistorikkReducer from './moduler/innstillinger/historikk/oppfolging-historikk-reducer';
import historiskeVilkarReducer from './moduler/vilkar/historiske-vilkar';
import identitetReducer from './moduler/identitet/identitet-reducer';
import innstillingerReducer from './moduler/innstillinger/innstillinger-reducer';
import kanalerReducer from './moduler/aktivitet/kanaler-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import oppgaveReducer from './moduler/innstillinger/opprett-oppgave/opprett-oppgave-reducer';
import oppgaveVeiledereReducer from './moduler/innstillinger/opprett-oppgave/hent-veieldere-for-oppgave-reducer';
import veilederePaEnhetReducer from './moduler/veiledere-pa-enhet/veiledere-pa-enhet-reducer';
import tildelVeilederReducer from './moduler/tildel-veileder/tildel-veileder-reducer';
import referatReducer from './moduler/aktivitet/aktivitet-referat-reducer';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-reducer';
import oppfolgingstatusReducer from './moduler/oppfoelgingsstatus/oppfoelgingsstatus-reducer';
import utskriftReducer from './moduler/utskrift/utskrift-duck';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner/aktivitet-versjoner-reducer';
import vilkarReducer from './moduler/vilkar/vilkar-reducer';
import veilederTilgangReducer from './felles-komponenter/veilederTilgang/veileder-tilgang-reducer';
import malverkReducer from './moduler/malverk/malverk-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        aktiviteter: aktiviteterReducer,
        arbeidsliste: arbeidslisteReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        behandlendeEnheter: behandlendeEnheterReducer,
        bruker: brukerReducer,
        dialog: dialogReducer,
        etiketter: etiketterReducer,
        filter: filterReducer,
        historiskeVilkar: historiskeVilkarReducer,
        identitet: identitetReducer,
        innstillinger: innstillingerReducer,
        oppgaveHistorikk: oppgaveHistorikkReducer,
        oppfolgingHistorikk: oppfolgingHistorikkReducer,
        kanaler: kanalerReducer,
        mal: malReducer,
        malListe: malListeReducer,
        oppgaveVeiledere: oppgaveVeiledereReducer,
        opprettOppgave: oppgaveReducer,
        referat: referatReducer,
        oppfolging: oppfolgingReducer,
        oppfoelgingsstatus: oppfolgingstatusReducer,
        versjoner: versjonReducer,
        vilkar: vilkarReducer,
        feature: featureReducer,
        veilederTilgang: veilederTilgangReducer,
        malverk: malverkReducer,
        veilederePaEnhet: veilederePaEnhetReducer,
        tildelVeileder: tildelVeilederReducer,
    }),
    view: combineReducers({
        dialog: dialogViewReducer,
        utskrift: utskriftReducer,
    }),
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
