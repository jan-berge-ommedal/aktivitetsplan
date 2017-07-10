import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

const cls = classes => classNames('prosess', classes);

function Prosess({
    tittel,
    knappetekst,
    onClick,
    laster,
    disabled,
    className,
    children,
}) {
    return (
        <article className={cls(className)}>
            <Undertittel className="prosess_overskrift">
                {tittel}
            </Undertittel>
            {children}
            <Knapp
                mini
                spinner={laster}
                autoDisableVedSpinner
                disabled={disabled}
                onClick={onClick}
            >
                {knappetekst}
            </Knapp>
        </article>
    );
}

Prosess.defaultProps = {
    laster: false,
    className: '',
    disabled: false,
};

Prosess.propTypes = {
    tittel: PT.string.isRequired,
    knappetekst: PT.string.isRequired,
    onClick: PT.func.isRequired,
    laster: PT.bool,
    className: PT.string,
    children: PT.node.isRequired,
    disabled: PT.bool,
};

export default Prosess;
