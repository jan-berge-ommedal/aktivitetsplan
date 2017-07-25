import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classNames from 'classnames';
import NavigasjonslinjeMeny from './navigasjonslinje-meny';
import Lenke from '../../../felles-komponenter/utils/lenke';
import Feature from '../../../felles-komponenter/feature/feature';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { hentDialog } from '../../../ducks/dialog';
import { dialogFilter } from '../../../moduler/filter/filter-utils';
import { erPrivatModus } from '../../../moduler/privat-modus/privat-modus-selector';

const NavigasjonsElement = ({ sti, tekstId, disabled, children }) => {
    const elementKlasser = classNames({
        navigasjonslinje__element: !disabled,
        'navigasjonslinje__lenke--disabled': disabled,
    });
    const element = (
        <Element className={elementKlasser}>
            <FormattedMessage id={tekstId} />
            <span className="navigasjonslinje__element-content">
                {children}
            </span>
        </Element>
    );

    if (disabled) {
        return element;
    }

    return (
        <Lenke href={sti} className="navigasjonslinje__lenke">
            {element}
        </Lenke>
    );
};

NavigasjonsElement.defaultProps = {
    children: null,
    disabled: false,
};

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node,
    disabled: PT.bool,
};

class Navigasjonslinje extends Component {
    componentDidMount() {
        this.props.doHentDialog();
    }

    render() {
        const {
            antallUlesteDialoger,
            privatModus,
            underOppfolging,
        } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement
                    sti="/dialog"
                    tekstId="navigasjon.dialog"
                    disabled={privatModus || underOppfolging === false}
                >
                    <TallAlert hidden={antallUlesteDialoger <= 0}>
                        {antallUlesteDialoger}
                    </TallAlert>
                </NavigasjonsElement>
                <NavigasjonsElement
                    sti="/mal"
                    tekstId="aktivitetsmal.mitt-mal"
                    disabled={privatModus}
                />
                <NavigasjonsElement
                    sti="/vilkar"
                    tekstId="navigasjon.vilkar"
                    disabled={privatModus}
                />
                <Feature name="navigasjonslinjemeny">
                    <NavigasjonslinjeMeny />
                </Feature>
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    privatModus: PT.bool.isRequired,
    underOppfolging: PT.bool,
};

Navigasjonslinje.defaultProps = {
    underOppfolging: undefined,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const dialog = stateData.dialog.data;
    return {
        antallUlesteDialoger: dialog
            .filter(d => !d.lest)
            .filter(d => dialogFilter(d, state)).length,
        privatModus: erPrivatModus(state),
        underOppfolging: stateData.situasjon.data.underOppfolging,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
