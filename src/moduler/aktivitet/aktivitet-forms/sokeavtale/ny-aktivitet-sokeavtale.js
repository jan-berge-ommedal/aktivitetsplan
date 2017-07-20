import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import SokeavtaleAktivitetForm, { formNavn } from './aktivitet-sokeavtale-form';
import history from '../../../../history';
import ModalHeader from '../../../../felles-komponenter/modal/modal-header';
import { lagNyAktivitet } from '../../aktivitet-actions';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import ModalContainer from '../../../../felles-komponenter/modal/modal-container';
import { LUKK_MODAL } from '../../../../ducks/modal';
import { aktivitetRoute } from '../../../../routing';
import Modal from '../../../../felles-komponenter/modal/modal';

function SokeavtaleAktivitet({
    onLagreNyAktivitet,
    formIsDirty,
    lukkModal,
    intl,
}) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: SOKEAVTALE_AKTIVITET_TYPE,
        };

        onLagreNyAktivitet(nyAktivitet).then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    };

    return (
        <Modal
            isOpen
            key="sokeavtaleAktivitetModal"
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });

                // eslint-disable-next-line no-alert
                if (!formIsDirty || confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            contentLabel="aktivitet-modal"
        >
            <article aria-labelledby="modal-sokeavtale-aktivitet-header">
                <ModalHeader
                    visConfirmDialog={formIsDirty}
                    tilbakeTekstId="ny-aktivitet-modal.tilbake"
                />
                <ModalContainer>
                    <SokeavtaleAktivitetForm
                        onSubmit={onLagNyAktivitetSubmit}
                        defaultTittel={intl.formatMessage({
                            id: 'sokeavtale-aktivitet-form.default-tittel',
                        })}
                    />
                </ModalContainer>
            </article>
        </Modal>
    );
}

SokeavtaleAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet => dispatch(lagNyAktivitet(aktivitet)),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

const mapStateToProps = state => ({
    formIsDirty: isDirty(formNavn)(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(SokeavtaleAktivitet)
);
