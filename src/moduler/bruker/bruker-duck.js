import * as Api from '../../ducks/api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('bruker');

export default reducer;

export function hentBruker(fnr) {
    return action(() => Api.hentPerson(fnr));
}
