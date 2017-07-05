import React from 'react';
import { FormattedMessage } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import { Element, Innholdstittel } from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import vilkarSvg from './vilkar-illustrasjon.svg';
import VisibleIfHOC from '../../hocs/visible-if';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import { formaterDatoKortManed } from '../../utils';

const VisibleIfElementFormattedMessage = VisibleIfHOC(props =>
    <Element className="vilkar__metaData">
        <FormattedMessage {...props} />
    </Element>
);

function VilkarInnhold({ vilkar }) {
    const formattertDato = formaterDatoKortManed(vilkar.dato);
    return (
        <div className="vilkar__innhold">
            <Bilde src={vilkarSvg} alt="Dekorativ illustrajon" />
            <Innholdstittel className="vilkar__tittel">
                <FormattedMessage id="vilkar.modal.gjeldende-tittel" />
            </Innholdstittel>
            <UnsafeHtml className="vilkar__tekst">
                {vilkar.tekst}
            </UnsafeHtml>
            <VisibleIfElementFormattedMessage
                visible={!!vilkar.vilkarstatus && !!vilkar.dato}
                id="vilkar.modal.gjeldende-status-dato"
                values={{ status: vilkar.vilkarstatus, dato: formattertDato }}
            />
        </div>
    );
}

VilkarInnhold.propTypes = {
    vilkar: AppPT.vilkar.isRequired,
};

export default hiddenIf(VilkarInnhold);
