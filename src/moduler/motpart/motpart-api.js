import { PERSON_BASE_URL } from '~config'; //eslint-disable-line
import { fetchToJson } from '../../ducks/utils';

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export default {};
