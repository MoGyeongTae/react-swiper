import * as React from "react";
import * as styles from "./Swipe.module.scss";
import SwipeItem from "../SwipeItem/SwipeItem";

function maximum(value: number, velocity: number, count: number = 0): number {
  const mul = Math.abs(value * velocity);
  return mul > 0.01 ? maximum(mul, velocity, count + 1) : count;
}

function getTime(): number {
  return new Date().getTime();
}

interface Props {
  children: React.ReactNodeArray;
  itemWidth: number;
}

interface State {
  width: number;
  pressedAt: number;
  x: number;
  startX: number;
  nativeStartX: number;
  accelerateX: number;
  isPressed: boolean;
}

class Swipe extends React.Component<Props, State> {
  swipeRef = React.createRef<HTMLDivElement>();
  cancelRequestAnimationFrame?: number;
  state: State = {
    width: 0,
    pressedAt: 0,
    x: 0,
    startX: 0,
    accelerateX: 0,
    nativeStartX: 0,
    isPressed: false
  };

  componentDidMount() {
    if (this.swipeRef.current) {
      this.setState({ width: this.swipeRef.current.offsetWidth });
    }

    window.addEventListener("mousemove", this.onMouseMove, { passive: false });
    window.addEventListener("mouseup", this.onMouseUp);

    this.cancelRequestAnimationFrame = window.requestAnimationFrame(this.onRender);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    if (this.cancelRequestAnimationFrame)
      window.cancelAnimationFrame(this.cancelRequestAnimationFrame);
  }

  onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x } = this.state;

    const startX = e.clientX;

    this.setState({
      isPressed: true,
      startX: startX - x,
      nativeStartX: startX,
      pressedAt: getTime()
    });
  };

  onMouseMove = (e: MouseEvent) => {
    const { isPressed, startX } = this.state;

    if (isPressed) {
      this.setState({ x: e.clientX - startX });
    }
  };

  onMouseUp = (e: MouseEvent) => {
    const { nativeStartX, pressedAt } = this.state;
    const unpressedAt = getTime();
    const between = unpressedAt - pressedAt;
    const distance = Math.abs(nativeStartX - e.clientX);

    this.setState({ isPressed: false, accelerateX: (20 / between * distance) * ((nativeStartX - e.clientX) > 0 ? -1 : 1) });
  };

  onRender = () => {
    const { x, width, accelerateX, isPressed, } = this.state;
    const { children: { length }, itemWidth } = this.props;

    if (!isPressed) {
      let nextAccelerateX = accelerateX;

      const minX = 0;
      const maxX = itemWidth * length - width;

      const isOverMinX = x > minX;
      const isOverMaxX = x < -maxX;


      if (isOverMinX) {
        nextAccelerateX -= x / maximum(nextAccelerateX, 0.9);
      } else if (isOverMaxX) {
        const overX = Math.abs(x) - maxX;
        nextAccelerateX += overX / maximum(nextAccelerateX, 0.9);
      }

      nextAccelerateX *= 0.9;

      this.setState({ x: x + nextAccelerateX, accelerateX: nextAccelerateX });
    }

    this.cancelRequestAnimationFrame = window.requestAnimationFrame(this.onRender);
  };

  render() {
    const { x } = this.state;
    const { children, itemWidth } = this.props;

    let key = 0;
    const SwipeItems = React.Children.map(children, child => {
      key++;
      return <SwipeItem key={key} width={itemWidth}>{child}</SwipeItem>;
    });

    return (
      <div className={styles.swipe} ref={this.swipeRef}>
        {x}
        <div className={styles.inner} onMouseDown={this.onMouseDown}>
          <div
            className={styles.items}
            style={{ transform: `translateX(${x}px)` }}
          >
            {SwipeItems}
          </div>
        </div>
      </div>
    );
  }
}

export default Swipe;
