import "babel-polyfill";
import React from "react";
import {Router, Route, IndexRoute, applyRouterMiddleware} from "react-router";
import {useScroll} from "react-router-scroll";
import {indexRoute} from "~config";
import ModalHeader from "./modal/modal-header";
import Hovedside from "./sider/hovedside/hovedside";
import NyAktivitet from "./modal/ny-aktivitet";
import EgenAktivitet from "./modal/skjema/egen-aktivitet";
import StillingAktivitet from "./modal/skjema/stilling-aktivitet";
import Aktivitetvisning from "./modal/visning/aktivitetvisning";
import EndreAktivitet from "./modal/redigering/endre-aktivitet";

const VisVilkar = () => <ModalHeader visVilkar/>;

export default (
    <Route>
        <IndexRoute component={Hovedside}/>
        <Route path="vilkar" component={Hovedside}>
            <IndexRoute component={VisVilkar}/>
        </Route>
        <Route path="aktivitet" component={Hovedside}>
            <Route modalId="modal1" path="ny" component={NyAktivitet}/>
            <Route modalId="modal2" path="ny/egen" component={EgenAktivitet}/>
            <Route modalId="modal4" path="ny/stilling" component={StillingAktivitet}/>
            <Route modalId="modal5" path="aktivitet/:id" component={Aktivitetvisning}/>
            <Route modalId="modal6" path="aktivitet/:id/endre" component={EndreAktivitet}/>
        </Route>
        <Route path="*" component={Hovedside}/>
    </Route>
);
