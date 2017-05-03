import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import Undertittel from 'nav-frontend-typografi/src/undertittel';
import Bilde from 'nav-react-design/dist/bilde';
import * as aktivitetstatus from '../../constant';
import Radio from '../skjema/input/radio';
import hengelasSVG from '../../img/hengelas.svg';

const leggTilHengelas = (tekst) => (
    <span>
        {tekst}&nbsp;&nbsp;<Bilde style={{ position: 'absolute' }} src={hengelasSVG} alt="hengelås ikon" />
    </span>
);

function OppdaterAktivitetStatus(props) {
    const erChecked = (id) => props.valgtStatus === id;
    const disableStatusEndring = props.status === aktivitetstatus.STATUS_AVBRUTT ||
        props.status === aktivitetstatus.STATUS_FULLFOERT;

    const radioSkjema = (
        <form className="skjema blokk-m oppdaterstatus-skjema">
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Foreslått"
                value={aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Planlagt"
                value={aktivitetstatus.STATUS_PLANLAGT}
                id={`id--${aktivitetstatus.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_PLANLAGT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Gjennomføres"
                value={aktivitetstatus.STATUS_GJENNOMFOERT}
                id={`id--${aktivitetstatus.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_GJENNOMFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas('Fullført')}
                value={aktivitetstatus.STATUS_FULLFOERT}
                id={`id--${aktivitetstatus.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_FULLFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas('Avbrutt')}
                value={aktivitetstatus.STATUS_AVBRUTT}
                id={`id--${aktivitetstatus.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_AVBRUTT)}
                disabled={disableStatusEndring}
            />
        </form>
    );

    return (
        <section>
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            {radioSkjema}
        </section>
    );
}

const OppdaterStatusReduxForm = reduxForm({
    form: 'oppdaterStatus-form'
})(OppdaterAktivitetStatus);

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    valgtStatus: PT.string
};

const mapStateToProps = (state, props) => ({
    aktiviteter: state.data.aktiviteter.data,
    valgtStatus: formValueSelector('oppdaterStatus-form')(state, 'aktivitetstatus'),
    initialValues: {
        aktivitetstatus: props.status
    }
});


export default connect(mapStateToProps, null)(OppdaterStatusReduxForm);
