import { Element } from './Element';

/**
 * Twitchのビデオに関するクラス
 */
export class TwitchVideo {
  private readonly PLAYER_QUERY = 'video';
  private readonly VOLUMESLIDER_QUERY = '[id^="player-volume-slider"]';

  protected player: Element<HTMLVideoElement>;
  protected slider: Element<HTMLInputElement>;

  private isMute: false | number;
  constructor() {
    this.player = new Element(this.PLAYER_QUERY);
    this.slider = new Element(this.VOLUMESLIDER_QUERY);
  }

  /**
   * 現在のボリュームを取得する。
   * 0~100の形で返却し、**切り捨てを行わない**
   * @returns
   */
  public getCurrentVolume(): number | null {
    if (!this.player.element) return null;
    const volume = this.player.element.volume;
    return volume * 100;
  }

  public incrementVolume() {
    const currentVolume = this.getCurrentVolume();
    let newVolume = currentVolume + 1;

    if (newVolume > 100) newVolume = 100;

    this.changeVolume(newVolume);
    return newVolume;
  }

  public decrementVolume() {
    const currentVolume = this.getCurrentVolume();
    let newVolume = currentVolume - 1;

    if (newVolume < 0) {
      newVolume = 0;
      this.isMute = currentVolume;
    }

    this.changeVolume(newVolume);
    return newVolume;
  }

  public toggleMute(): number {
    if (this.isMute) {
      // unmute
      const newVolume = this.isMute;
      this.isMute = false;

      this.changeVolume(newVolume);
      return newVolume;
    } else {
      // mute
      const currentVolume = this.getCurrentVolume();
      this.isMute = currentVolume;
      this.changeVideoVolume(0);
      this.changeVolumeSlider(0);
      return 0;
    }
  }

  public changeVolume(volume: number) {
    const decimalVolume = volume / 100;
    this.changeVideoVolume(decimalVolume);
    this.changeVolumeSlider(decimalVolume);
  }

  private changeVideoVolume(decimalVolume: number) {
    if (!this.player.element) return;
    this.player.element.volume = decimalVolume;
  }

  private changeVolumeSlider(decimalVolume: number) {
    if (!this.slider.element) return;
    decimalVolume = parseFloat(decimalVolume.toFixed(2));

    this.slider.element.value = `${decimalVolume}`;
    this.slider.element.setAttribute('aria-valuenow', `${Math.round(decimalVolume * 100)}`);
    this.slider.element.setAttribute('aria-valuetext', `${Math.round(decimalVolume * 100)}`);

    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    this.slider.element.dispatchEvent(inputEvent);
  }
}
