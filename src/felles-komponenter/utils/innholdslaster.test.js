/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from './innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING }]}>
                Children
            </Innholdslaster>
        );

        expect(wrapper.find('Spinner')).to.exist; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre feilmeldign hvis det har oppstått en feil på noen avhengigheter', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.ERROR }]}>
                Children
            </Innholdslaster>
        );

        expect(wrapper.find('Feilmelding')).to.exist; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                <div className="unik-klasse" />
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('unik-klasse')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const renderDiv = () => <div className="div-fra-func" />;
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                {renderDiv}
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('div-fra-func')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre feilmelding om noen av avhengighetene er ok, men andre har feilet', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }, { status: STATUS.ERROR }]}>
                Children
            </Innholdslaster>
        );

        expect(wrapper.find('Feilmelding')).to.exist; // eslint-disable-line no-unused-expressions
    });
});
