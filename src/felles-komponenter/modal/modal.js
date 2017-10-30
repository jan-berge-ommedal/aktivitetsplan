import React from 'react';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import classNames from 'classnames';
import ModalHeader from './modal-header';
import history from '../../history';
import Innholdslaster from '../utils/innholdslaster';
import Feilmelding from '../../moduler/feilmelding/feilmelding';

function Modal({
    header,
    children,
    avhengigheter,
    onRequestClose,
    className,
    minstEnAvhengighet,
    ...props
}) {
    return (
        <NavFrontendModal
            {...props}
            isOpen
            className={classNames('aktivitet-modal', className)}
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            shouldCloseOnOverlayClick={false}
            onRequestClose={onRequestClose}
        >
            {header}
            <Feilmelding className="feilmelding--systemfeil" />
            <Innholdslaster
                minstEn={minstEnAvhengighet}
                avhengigheter={avhengigheter}
            >
                {children}
            </Innholdslaster>
        </NavFrontendModal>
    );
}

Modal.defaultProps = {
    onRequestClose: () => history.push('/'),
    className: '',
    header: <ModalHeader />,
    avhengigheter: [],
    minstEnAvhengighet: false,
};

Modal.propTypes = {
    onRequestClose: PT.func,
    className: PT.string,
    header: PT.node,
    children: PT.node.isRequired,
    avhengigheter: PT.array,
    minstEnAvhengighet: PT.bool,
};

export default Modal;
