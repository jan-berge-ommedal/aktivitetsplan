import React, { Component, PropTypes as PT } from 'react';
import ScrollArea from 'react-scrollbar';
import classNames from 'classnames';
import { autobind } from '../../utils';

const KOLLONE_BREDDE = 343;
const VIEWPORT_BREDDE = 1713;

const tavleClassname = (className) => classNames('tavle', className);

class Tavle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPosition: 0,
            containerWidth: 0,
            scrollArea: null
        };
        autobind(this);
    }

    onVisForrige() {
        const index = Math.ceil(this.state.leftPosition / KOLLONE_BREDDE) - 1;
        this.state.scrollArea.scrollXTo(index * KOLLONE_BREDDE);
    }

    onVisNeste() {
        const index = Math.floor((this.state.containerWidth + this.state.leftPosition) / KOLLONE_BREDDE) + 1;
        this.state.scrollArea.scrollXTo((index * KOLLONE_BREDDE) - this.state.containerWidth);
    }

    updateScroll(value) {
        this.setState({
            leftPosition: typeof value.leftPosition !== 'undefined' ? value.leftPosition : this.state.leftPosition,
            containerWidth: value.containerWidth || this.state.containerWidth
        });
    }

    lagreScrollArea(ref) {
        this.setState({ scrollArea: ref });
    }

    render() {
        const { children, className } = this.props;

        const kolonner = children.map((child, index) => (
            <div key={child.key || index} className="tavle-kolonne">
                {child}
            </div>
        ));

        const venstreKnapp = this.state.leftPosition > 0 && (
        <button className="knapp-forrige knapp-tavle" onClick={this.onVisForrige}>&lt;</button>
            );

        const hoyreKnapp = this.state.leftPosition + this.state.containerWidth < VIEWPORT_BREDDE && (
        <button className="knapp-neste knapp-tavle" onClick={this.onVisNeste}>&gt;</button>
            );


        return (
            <div className={tavleClassname(className)}>
                {venstreKnapp}
                <ScrollArea
                    ref={this.lagreScrollArea}
                    onScroll={this.updateScroll}
                    smoothScrolling
                >
                    <div className="viewport">
                        <div className="kolonner">
                            {kolonner}
                        </div>
                    </div>
                </ScrollArea>
                {hoyreKnapp}
            </div>
        );
    }
}

Tavle.propTypes = {
    className: PT.string,
    children: PT.arrayOf(PT.element).isRequired
};

export default Tavle;
