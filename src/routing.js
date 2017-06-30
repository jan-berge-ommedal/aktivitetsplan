import 'babel-polyfill';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hovedside from './sider/hovedside/hovedside';
import VilkarModal from './moduler/vilkar/vilkar-modal';
import VilkarModalMedHistorikk from './modal/vilkar/vilkar-med-historikk';
import VilkarModalUtenHistorikk from './modal/vilkar/vilkar-uten-historikk';
import NyAktivitet from './modal/ny-aktivitet';
import EgenAktivitet from './modal/skjema/egen-aktivitet';
import StillingAktivitet from './modal/skjema/stilling-aktivitet';
import SokeavtaleAktivitet from './modal/skjema/sokeavtale-aktivitet';
import Aktivitetvisning from './modal/visning/aktivitetvisning';
import EndreAktivitet from './modal/redigering/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';
import FullforAktivitet from './modal/ferdigstilt/fullfor-aktivitet';
import AvbrytAktivitet from './modal/ferdigstilt/avbryt-aktivitet';
import AktivitetmalEndre from './sider/hovedside/mal/aktivitetsmal-endre';
import Aktivitetsmal from './sider/hovedside/mal/aktivitetsmal';
import Prosesser from './moduler/innstillinger/prosesser/prosesser';
import AvsluttOppfolging
    from './moduler/innstillinger/avslutt-oppfolging/avslutt-oppfolginsperiode';
import BekreftAvsluttOppfolging
    from './moduler/innstillinger/avslutt-oppfolging/bekreft-avslutt-oppfolginsperiode';
import BekreftStartOppfolging
    from './moduler/innstillinger/start-oppfolging/bekreft-start-oppfolginsperiode';
import StartOppfolgingKvittering
    from './moduler/innstillinger/start-oppfolging/start-oppfolging-kvittering';
import AvsluttOppfolgingKvittering
    from './moduler/innstillinger/avslutt-oppfolging/avslutt-oppfolging-kvittering';
import SettManuellOppfolging
    from './moduler/innstillinger/sett-manuell-oppfolging/sett-manuell-oppfolging';
import SettManuellOppfolgingKvittering
    from './moduler/innstillinger/sett-manuell-oppfolging/sett-manuell-oppfolging-kvittering';
import { VIS_INNSTILLINGER } from '~config'; // eslint-disable-line

export const aktivitetRoute = aktivitetId => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = aktivitetId =>
    `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = aktivitetId =>
    `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = aktivitetId =>
    `/aktivitet/avbryt/${aktivitetId}`;

export default (
    <Route component={Hovedside}>
        <IndexRoute />
        <Route path="vilkar" component={VilkarModal} />
        <Route path="mal" component={Aktivitetsmal} />
        <Route path="mal/endre" component={AktivitetmalEndre} />
        {VIS_INNSTILLINGER &&
            <Route>
                <Route path="innstillinger" component={Prosesser} />
                <Route
                    path="innstillinger/manuell"
                    component={SettManuellOppfolging}
                />
                <Route
                    path="innstillinger/manuell/kvittering"
                    component={SettManuellOppfolgingKvittering}
                />
                <Route
                    path="innstillinger/avslutt"
                    component={AvsluttOppfolging}
                />
                <Route
                    path="innstillinger/avslutt/bekreft"
                    component={BekreftAvsluttOppfolging}
                />
                <Route
                    path="innstillinger/avslutt/kvittering"
                    component={AvsluttOppfolgingKvittering}
                />
                <Route
                    path="innstillinger/start/bekreft"
                    component={BekreftStartOppfolging}
                />
                <Route
                    path="innstillinger/start/kvittering"
                    component={StartOppfolgingKvittering}
                />
            </Route>}
        <Route path="dialog" component={DialogModal} />
        <Route path="dialog/:id" component={DialogModal} />
        <Route path="vilkarhistorikk" component={VilkarModalMedHistorikk} />
        <Route
            path="vilkarhistorikk/:key"
            component={VilkarModalUtenHistorikk}
        />
        <Route path="aktivitet">
            <Route path="ny" component={NyAktivitet} />
            <Route path="ny/egen" component={EgenAktivitet} />
            <Route path="ny/stilling" component={StillingAktivitet} />
            <Route path="ny/sokeavtale" component={SokeavtaleAktivitet} />
            <Route path="vis/:id" component={Aktivitetvisning} />
            <Route path="endre/:id" component={EndreAktivitet} />
            <Route path="avbryt/:id" component={AvbrytAktivitet} />
            <Route path="fullfor/:id" component={FullforAktivitet} />
        </Route>
        <Route path="*" />
    </Route>
);
