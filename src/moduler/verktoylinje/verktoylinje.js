import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import { selectErPrivatModus } from '../privat-modus/privat-modus-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';

function Verktoylinje({ viserHistoriskPeriode, privatModus }) {
    return (
        <div className="verktoylinje">
            <div className="verktoylinje__verktoy">
                <Lenkeknapp
                    type="hoved"
                    href="/aktivitet/ny"
                    disabled={viserHistoriskPeriode || privatModus}
                >
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
            </div>
            <div className="verktoylinje__verktoy-container">
                <PeriodeFilter className="verktoylinje__verktoy" />
                <Filter className="verktoylinje__verktoy" />
            </div>
        </div>
    );
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
    privatModus: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    viserHistoriskPeriode: selectViserHistoriskPeriode(state),
    privatModus: selectErPrivatModus(state),
});

export default connect(mapStateToProps)(Verktoylinje);
