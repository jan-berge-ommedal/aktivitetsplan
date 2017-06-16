import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Bilde from 'nav-react-design/dist/bilde';
import { DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { flyttAktivitet } from '../../../ducks/aktiviteter';
import AktivitetsKort from '../aktivitetskort/aktivitetskort';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../../constant';
import history from '../../../history';
import hengelasSvg from '../../../img/hengelas.svg';
import { fullforAktivitetRoute, avbrytAktivitetRoute } from '../../../routing';
import { aktivitetFilter } from '../../../moduler/filter/filter-utils';

const mottaAktivitetsKort = {
    canDrop(props, monitor) {
        return props.status !== monitor.getItem().status;
    },

    drop({ doFlyttAktivitet, status }, monitor) {
        const aktivitet = monitor.getItem();
        // utsett håndteringen til droppet er fullført. Unngår f.eks. F17HL3-144
        setTimeout(() => {
            if (status === STATUS_FULLFOERT) {
                history.push(fullforAktivitetRoute(aktivitet.id));
            } else if (status === STATUS_AVBRUTT) {
                history.push(avbrytAktivitetRoute(aktivitet.id));
            } else {
                doFlyttAktivitet(aktivitet, status);
            }
        });
    },
};

function collect(theConnect, monitor) {
    return {
        drag: monitor.isOver(),
        connectDropTarget: theConnect.dropTarget(),
    };
}

function compareAktivitet(a, b) {
    if (b.avtalt && !a.avtalt) {
        return 1;
    } else if (!b.avtalt && a.avtalt) {
        return -1;
    }
    return b.opprettetDato.localeCompare(a.opprettetDato);
}

function KolonneFunction({
    aktiviteter,
    status,
    tittelId,
    connectDropTarget,
    drag,
}) {
    const aktivitetsKort = aktiviteter
        .filter(a => {
            if (a.nesteStatus) {
                return a.nesteStatus === status;
            }
            return a.status === status;
        })
        .sort((a, b) => compareAktivitet(a, b))
        .map(a => <AktivitetsKort key={a.id} aktivitet={a} />);

    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <div
                className={classNames(
                    'aktivitetstavle__kolonne',
                    drag && 'aktivitetstavle__kolonne--drag'
                )}
            >
                <Undertittel
                    className="aktivitetstavle__kolonne-header"
                    tag="h1"
                >
                    <FormattedMessage id={tittelId} />
                    {{ [STATUS_FULLFOERT]: true, [STATUS_AVBRUTT]: true }[
                        status
                    ] &&
                        <Bilde
                            className="aktivitetstavle__kolonne-header-bilde"
                            src={hengelasSvg}
                            alt="hengelåsikon"
                        />}
                </Undertittel>
                {aktivitetsKort}
            </div>
        </div>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    tittelId: PT.string.isRequired,
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    doFlyttAktivitet: PT.func.isRequired,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const aktiviteter = stateData.aktiviteter.data
        .concat(stateData.arenaAktiviteter.data)
        .filter(a => aktivitetFilter(a, state));
    return {
        aktiviteter,
    };
};

const mapDispatchToProps = dispatch => ({
    doFlyttAktivitet: (aktivitet, status) =>
        flyttAktivitet(aktivitet, status)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(KolonneFunction)
);
