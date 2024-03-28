class RightClickScroll {
  private readonly RIGHTCLICK_KEYCODE = 2;

  private startListener: RightClickScrollListener;
  private endListener: RightClickScrollListener;
  private scrollUpListener: RightClickScrollListener;
  private scrollDownListener: RightClickScrollListener;

  private isRightClickDown: boolean = false;
  private isFirst: boolean = false;
  private timer: NodeJS.Timeout;

  constructor(options: {
    start: RightClickScrollListener;
    end: RightClickScrollListener;
    scrollUp: RightClickScrollListener;
    scrollDown: RightClickScrollListener;
  }) {
    this.startListener = options.start;
    this.endListener = options.end;
    this.scrollUpListener = options.scrollUp;
    this.scrollDownListener = options.scrollDown;

    document.addEventListener('mouseup', e => this.mouseupHandler(e));
    document.addEventListener('mousedown', e => this.mousedownHandler(e));
    document.addEventListener('wheel', e => this.wheelHandler(e), { passive: false });
  }

  private mouseupHandler(event: MouseEvent) {
    if (event.button === this.RIGHTCLICK_KEYCODE && this.isOnVideo(event)) {
      this.isRightClickDown = false;
      this.endListener();

      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
  }

  private mousedownHandler(event: MouseEvent) {
    if (event.button === this.RIGHTCLICK_KEYCODE && this.isOnVideo(event)) {
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
      this.startListener();
    }

    if (this.isRightClickDown && this.isOnVideo(event)) {
      if (event.deltaY > 0) {
        this.scrollDownListener();
      } else {
        this.scrollUpListener();
      }

      event.preventDefault();
    }
  }

  private isOnVideo(event: MouseEvent | WheelEvent) {
    let isOnVideo = false;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    elements.forEach(element => {
      if (element.tagName.toLowerCase() === 'video') isOnVideo = true;
    });
    return isOnVideo;
  }
}

type RightClickScrollListener = () => void;

(() => {
  console.log('Content scripts loaded');
  const currentLocation = new URL(location.href);
  const locationWhitelist = ['www.twitch.tv'];

  if (locationWhitelist.includes(currentLocation.host)) {
    console.log('Twitch.tv now');
    new RightClickScroll({
      start: () => {
        console.log('Scroll start');
      },
      end: () => {
        console.log('Scroll end');
      },
      scrollUp: () => {
        console.log('Scroll Up');
      },
      scrollDown: () => {
        console.log('Scroll Down');
      },
    });
  } else {
    console.log('isnot twitch.tv now');
  }
})();
