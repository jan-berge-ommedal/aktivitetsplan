import React, { PropTypes as PT } from 'react';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerCheckboxComponent({ input, labelId, errorMessage }) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    return (
        <NavCheckbox label={<FormattedMessage id={labelId} />} feil={feil} checked={input.value} {...input} />
    );
}

InnerCheckboxComponent.propTypes = {
    labelId: PT.string.isRequired,
    errorMessage: PT.arrayOf(PT.string),
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

function Checkbox({ feltNavn, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            errorClass="skjemaelement--harFeil"
            customComponent={<InnerCheckboxComponent {...rest} />}
        />
    );
}

Checkbox.propTypes = {
    feltNavn: PT.string.isRequired
};

export default Checkbox;
