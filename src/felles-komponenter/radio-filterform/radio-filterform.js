import React, { PropTypes as PT, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Hovedknapp from 'nav-frontend-knapper/src/hovedknapp';
import { HiddenIf } from '../../utils';

class RadioFilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: undefined };
        this.changeSelected = this.changeSelected.bind(this);
    }

    changeSelected(e) {
        this.setState({ selected: e });
    }

    render() {
        const {
            onSubmit,
            data,
            createLabel,
            createValue,
            radioName,
            fjernNullstill,
            ...rest
        } = this.props;
        const { selected } = this.state;
        return (
            <div className="radio-filterform">
                <div className="radio-filterform__valg">
                    {data.map(o =>
                        <Radio
                            name={radioName}
                            label={createLabel(o)}
                            value={createValue(o)}
                            id={createValue(o)}
                            key={createValue(o)}
                            onChange={e => this.changeSelected(e.target.value)}
                        />
                    )}
                </div>
                <div className="knapperad blokk-xxs">
                    <Hovedknapp
                        mini
                        className="radio-velg--knapp"
                        onClick={event =>
                            onSubmit({ event, value: selected, ...rest })}
                        disabled={!selected}
                    >
                        <FormattedMessage id="components.filterform.button.velg" />
                    </Hovedknapp>
                    <HiddenIf hidden={fjernNullstill}>
                        <Knapp
                            mini
                            onClick={event => {
                                this.changeSelected(undefined);
                                onSubmit({ event, value: null, ...rest });
                            }}
                        >
                            <FormattedMessage id="components.filterform.button.nullstill" />
                        </Knapp>
                    </HiddenIf>
                </div>
            </div>
        );
    }
}

RadioFilterForm.propTypes = {
    data: PT.arrayOf(PT.object).isRequired,
    onSubmit: PT.func.isRequired,
    createLabel: PT.func.isRequired,
    createValue: PT.func.isRequired,
    radioName: PT.string.isRequired,
    fjernNullstill: PT.bool,
};

RadioFilterForm.defaultProps = {
    fjernNullstill: false,
};

export default RadioFilterForm;
