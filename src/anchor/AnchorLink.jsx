import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Anchor.scss';


class AnchorLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  parent() {
    return this.context.component;
  }

  componentDidMount() {
    this.parent().registerLink(this.props.href);
  }

  componentDidUpdate({href: prevhref}) {
    const {href} = this.props;
    if (prevhref !== href) {
      this.parent().unregisteLink(prevhref);
      this.parent().registerLink(href);
    }
  }

  componentWillUnmount() {
    this.parent().unregisteLink(this.props.href);
  }

  clickHandler = (e) => {
    const {href, title} = this.props;
    const {scrollTo} = this.parent().state;
    const {onClick} = this.parent();
    if (onClick) {
      onClick(e, {href, title})
    }
    scrollTo(href);
  }


  render() {
    const {href, target, title, children} = this.props;
    let isActive = this.parent().state.activeLink === href;
    const wrapperClassName = this.classname('hui-anchorlink', {
      'hui-anchorlink--active': isActive
    })
    const titleClassName = this.classnames('hui-anchorlink__title', {
      'hui-anchorlink__title--active': isActive
    })
    return (
      <div style={this.styles()} className={wrapperClassName}>
        <a
          className={titleClassName}
          href={href}
          target={target}
          title={title ?? ''}
          onClick={this.clickHandler}>
          {title}
        </a>
        {children}
      </div>
    )
  }
}

AnchorLink.propTypes = {
  href: PropType.string,
  target: PropType.string,
  title: PropType.node,
}

AnchorLink.defaultProps = {
  href: '#'
}

AnchorLink.contextTypes = {
  component: PropType.any,
}