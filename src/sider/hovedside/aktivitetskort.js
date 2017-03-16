import React, { PropTypes as PT } from 'react';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as AppPT from '../../proptypes';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { formaterDato } from '../../utils';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';

const dndSpec = {

    beginDrag({ aktivitet }) {
        return aktivitet;
    }

};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function AktivitetsKort({ aktivitet, isDragging, connectDragSource }) {
    const erFlyttbar = !aktivitet.nesteStatus && ![STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status);

    const aktivitetsKort = (
        <div style={{ opacity: isDragging ? 0.4 : 1 }}>
            <Link
                to={`aktivitet/aktivitet/${aktivitet.id}`}
                className={classNames('aktivitetskort', erFlyttbar && 'aktivitetskort--flyttbar')}
            >
                <div>
                    <div className="aktivitetskort__blokk">
                        <p className="aktivitetskort__type">{aktivitet.type}</p>
                        <p className="aktivitetskort__tittel">{aktivitet.tittel}</p>
                        <p>{ [formaterDato(aktivitet.fraDato), formaterDato(aktivitet.tilDato)].filter((d) => d).join(' - ') }</p>
                        <p style={{ color: 'red' }}>{ /* TODO hvordan håndtere feil? */ aktivitet.error}</p>
                    </div>
                    <AktivitetskortTillegg aktivitet={aktivitet} />
                </div>
            </Link>
        </div>
    );

    return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired
};

export default DragSource('AktivitetsKort', dndSpec, collect)(AktivitetsKort);

