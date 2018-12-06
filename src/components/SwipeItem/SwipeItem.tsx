import * as React from 'react';
import * as styles from './SwipeItem.module.scss';

interface Props {
  width: number;
  children: React.ReactNode;
}

interface State {

}

class SwipeItem extends React.PureComponent<Props, State> {
  render() {
    const { children, width } = this.props;

    return (
      <div className={styles.swipeItem} style={{ flex: `0 0 ${width}px` }}>
        <div className={styles.inner}>
          {children}
        </div>
      </div>
    );
  }
}

export default SwipeItem;