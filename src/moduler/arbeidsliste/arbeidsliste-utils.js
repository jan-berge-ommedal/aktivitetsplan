import React from 'react';
import { rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { moment } from '../../utils';

export const lagArbeidsliste = (fnr, form, props) => ({
    fnr,
    veilederId: props.veileder,
    kommentar: form.kommentar,
    overskrift: form.overskrift,
    frist: form.frist,
});

export const OVERSKRIFT_MAKS_LENGDE = 12;
export const KOMMENTAR_MAKS_LENGDE = 500;
export const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="arbeidsliste.feilmelding.for-kort" />
);

export const pakrevdOverskrift = rules.minLength(
    0,
    <FormattedMessage id="arbeidsliste.overskrift.feilmelding.for-kort" />
);

export const begrensetKommentarLengde = rules.maxLength(
    KOMMENTAR_MAKS_LENGDE,
    <FormattedMessage
        id="arbeidsliste-form.feilmelding.kommentar-lengde"
        values={{ MAKS_LENGDE: KOMMENTAR_MAKS_LENGDE }}
    />
);

export const begrensetOverskriftLengde = rules.maxLength(
    KOMMENTAR_MAKS_LENGDE,
    <FormattedMessage
        id="arbeidsliste-form.feilmelding.kommentar-lengde"
        values={{ MAKS_LENGDE: OVERSKRIFT_MAKS_LENGDE }}
    />
);

export function fristErEtterIDag(value) {
    return !value ||
    moment(value).isAfter(moment().subtract(1, 'day').startOf('day'), 'd')
        ? undefined
        : <FormattedMessage id="arbeidsliste-form.feilmeleding.frist.etter" />;
}
