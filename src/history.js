import { createBrowserHistory } from 'history';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line

function nyURLHarQueryString(url) {
    return url.indexOf('?') !== -1;
}

function prependBasePath(fn) {
    return url => {
        const fodselsnummer = getFodselsnummer();
        const urlParams = nyURLHarQueryString(url) ? '' : location.search;
        const fodselsnummerPath = `/${fodselsnummer}`;
        return fn.call(this, {
            pathname:
                (fodselsnummer && !url.startsWith(fodselsnummerPath)
                    ? fodselsnummerPath
                    : '') +
                (url.startsWith('/') ? '' : '/') +
                url,
            search: urlParams,
        });
    };
}

export default function createHistory() {
    const routerHistory = createBrowserHistory({
        basename: CONTEXT_PATH,
    });

    routerHistory.push = prependBasePath(routerHistory.push);
    routerHistory.replace = prependBasePath(routerHistory.replace);
    return routerHistory;
}
