import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import AktivitetEtikett from '../../../felles-komponenter/aktivitet-etikett';
import * as AppPT from '../../../proptypes';
import { AVTALT_MED_NAV } from '../../../constant';
import visibleIfHOC from '../../../hocs/visible-if';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';

function AktivitetskortTillegg({
    aktivitet,
    antallHendvendelser,
    antallUlesteHenvendelser,
}) {
    return (
        <div className="aktivitetskort__ikon-blokk">
            <div className="aktivitetskort__etiketter">
                <AktivitetEtikett
                    visible={aktivitet.avtalt}
                    etikett={AVTALT_MED_NAV}
                    id={AVTALT_MED_NAV}
                />
                <AktivitetEtikett
                    visible={!!aktivitet.etikett}
                    etikett={aktivitet.etikett}
                    id={`etikett.${aktivitet.etikett}`}
                />
            </div>
            <HiddenIfDiv
                hidden={antallHendvendelser <= 0}
                className="aktivitetskort__henvendelser"
            >
                <TallAlert hidden={antallUlesteHenvendelser <= 0}>
                    {antallUlesteHenvendelser}
                </TallAlert>
            </HiddenIfDiv>
        </div>
    );
}

AktivitetskortTillegg.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    antallHendvendelser: PT.number.isRequired,
    antallUlesteHenvendelser: PT.number.isRequired,
};

const mapStateToProps = (state, props) => {
    const dialoger = state.data.dialog.data;
    const dialog = dialoger.find(d => d.aktivitetId === props.aktivitet.id);
    const antallHendvendelser = dialog ? dialog.henvendelser.length : 0;
    const antallUlesteHenvendelser = dialog
        ? dialog.henvendelser.filter(h => !h.lest).length
        : 0;
    return {
        antallHendvendelser,
        antallUlesteHenvendelser,
    };
};

export default visibleIfHOC(
    connect(mapStateToProps, null)(AktivitetskortTillegg)
);
