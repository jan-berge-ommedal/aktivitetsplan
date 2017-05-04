import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { visibleIfHOC } from '../../hocs/visible-if';
import './knappelenke.less';

function Knappelenke({ onClick, className, ...rest }) {
    function click(e) {
        e.preventDefault();
        onClick(e);
    }

    return (
        <button
            {...rest}
            className={classNames('knappelenke', className)}
            onClick={click}
        />
    );
}

Knappelenke.propTypes = {
    onClick: PT.func.isRequired,
    className: PT.string
};

export default visibleIfHOC(Knappelenke);