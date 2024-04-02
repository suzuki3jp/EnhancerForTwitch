import { TwitchVideo } from './TwitchVideo';

/**
 * 特定要素上のマウス操作を管理するクラス
 */
export class MouseControl extends TwitchVideo {
  private readonly RIGHTCLICK_KEYCODE = 2;

  private listeners: Record<ScrollEvents, ScrollEventListener[]>;
  private isRightClickDown: boolean = false;
  private isFirst: boolean = false;
  private timer: NodeJS.Timeout;
  constructor() {
    super();
    this.listeners = {
      start: [],
      end: [],
      up: [],
      down: [],
    };

    document.addEventListener('mouseup', e => this.mouseupHandler(e));
    document.addEventListener('mousedown', e => this.mousedownHandler(e));
    document.addEventListener('wheel', e => this.wheelHandler(e), { passive: false });
  }

  private mouseupHandler(event: MouseEvent) {
    if (event.button === this.RIGHTCLICK_KEYCODE && this.isOnElement(event)) {
      this.isRightClickDown = false;
      this.listeners.end.forEach(l => l());

      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
  }

  private mousedownHandler(event: MouseEvent) {
    if (event.button === this.RIGHTCLICK_KEYCODE && this.isOnElement(event)) {
      this.isRightClickDown = true;
      this.timer = setTimeout(function () {
        this.timer = null;
      }, 500);
      this.isFirst = true;
    }
  }

  private wheelHandler(event: WheelEvent) {
    if (this.isFirst) {
      this.isFirst = false;
      this.listeners.start.forEach(l => l());
    }

    if (this.isRightClickDown && this.isOnElement(event)) {
      if (event.deltaY > 0) {
        this.listeners.down.forEach(l => l());
      } else {
        this.listeners.up.forEach(l => l());
      }

      event.preventDefault();
    }
  }

  private isOnElement(event: MouseEvent | WheelEvent) {
    let isOnElement = false;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    elements.forEach(element => {
      if (element === this.player.element) isOnElement = true;
    });
    return isOnElement;
  }

  addEventListener(name: ScrollEvents, listener: ScrollEventListener) {
    this.listeners[name].push(listener);
  }
}

export type ScrollEvents = 'start' | 'end' | 'up' | 'down';

export type ScrollEventListener = () => void;
