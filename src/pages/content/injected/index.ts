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

class TwitchVideo {
  private readonly PLAYER_QUERY = 'video';
  private readonly VOLUMESLIDER_QUERY = '[id^="player-volume-slider"]';

  private player: HTMLVideoElement;

  constructor() {
    this.player = this.getCurrentVideo();
  }

  public getCurrentVolume() {
    return this.player.volume;
  }

  public incrementVolume() {
    const currentVolume = this.player.volume * 100;
    let newVolume = currentVolume + 1;

    if (newVolume > 100) newVolume = 100;

    this.changeVolume(newVolume);
    return newVolume;
  }
  public decrementVolume() {
    const currentVolume = this.player.volume * 100;
    let newVolume = currentVolume - 1;

    if (newVolume < 0) newVolume = 0;
    this.changeVolume(newVolume);
    return newVolume;
  }

  public changeVolume(volume: number) {
    const decimalVolume = volume / 100;
    this.changeVideoVolume(decimalVolume);
    this.changeVolumeSlider(decimalVolume);
    this.changeVolumeLocalStrage(decimalVolume);
  }

  private changeVideoVolume(decimalVolume: number) {
    this.player.volume = decimalVolume;
  }

  private changeVolumeSlider(decimalVolume: number) {
    decimalVolume = parseFloat(decimalVolume.toFixed(2));
    const slider = document.querySelector<HTMLInputElement>(this.VOLUMESLIDER_QUERY);
    slider.value = `${decimalVolume}`;
    slider.setAttribute('aria-valuenow', `${Math.round(decimalVolume * 100)}`);
    slider.setAttribute('aria-valuetext', `${Math.round(decimalVolume * 100)}`);

    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    slider.dispatchEvent(inputEvent);
  }

  private changeVolumeLocalStrage(decimalVolume: number) {
    localStorage.setItem('volume', `${decimalVolume}`);
  }

  private getCurrentVideo() {
    return document.body.querySelector(this.PLAYER_QUERY);
  }
}

class VolumeOverlay {
  private parentOverlay = document.querySelector<HTMLDivElement>('.click-handler');
  private overlay: HTMLDivElement;

  constructor(defaultVolume: number | string = 0) {
    this.overlay = this.createOverlay(Math.floor(Number(defaultVolume)));
    this.putOverlay();
  }

  public changeText(volume: number | string) {
    this.overlay.textContent = String(Math.floor(Number(volume)));
  }

  private putOverlay() {
    this.parentOverlay.appendChild(this.overlay);
  }

  public showOverlay() {
    this.overlay.style.display = 'table-cell';
  }

  public hideOverlay() {
    this.overlay.style.display = 'none';
  }

  private createOverlay(defaultValue: number | string) {
    this.parentOverlay.style.position = 'relative';
    const e = document.createElement('div');
    e.textContent = String(defaultValue);
    e.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    e.style.position = 'absolute';
    e.style.top = '0';
    e.style.display = 'none';
    e.style.height = '10%';
    e.style.width = '100%';
    e.style.textAlign = 'center';
    e.style.verticalAlign = 'middle';
    e.style.fontSize = '50px';
    return e;
  }
}

(() => {
  const currentLocation = new URL(location.href);
  const locationWhitelist = ['www.twitch.tv'];

  if (locationWhitelist.includes(currentLocation.host)) {
    const video = new TwitchVideo();
    const overlay = new VolumeOverlay(video.getCurrentVolume());
    new RightClickScroll({
      start: () => {
        overlay.showOverlay();
      },
      end: () => {
        overlay.hideOverlay();
      },
      scrollUp: () => {
        const volume = video.incrementVolume();
        overlay.changeText(volume);
      },
      scrollDown: () => {
        const volume = video.decrementVolume();
        overlay.changeText(volume);
      },
    });
  }
})();
