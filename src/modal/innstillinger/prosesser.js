import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import AvsluttOppfolgingProsess from './avslutt-oppfolging-prosess';
import StartOppfolgingProsess from './start-oppfolging-prosess';

function Prosesser({ underOppfolging, kanStarte }) {
    return (
        <div>
            <AvsluttOppfolgingProsess hidden={!underOppfolging} />
            <StartOppfolgingProsess hidden={!kanStarte} />
        </div>
    );
}

Prosesser.defaultProps = {
    underOppfolging: false,
    kanStarte: false,
};

Prosesser.propTypes = {
    underOppfolging: PT.bool,
    kanStarte: PT.bool,
};

const mapStateToProps = state => ({
    underOppfolging: state.data.situasjon.data.underOppfolging,
    kanStarte: state.data.situasjon.data.kanStarteOppfolging,
});

export default connect(mapStateToProps)(Prosesser);
