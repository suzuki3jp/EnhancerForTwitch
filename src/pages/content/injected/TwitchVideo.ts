export class TwitchVideo {
  private readonly PLAYER_QUERY = 'video';
  private readonly VOLUMESLIDER_QUERY = '[id^="player-volume-slider"]';

  private player: HTMLVideoElement;

  constructor() {
    this.player = this.getCurrentVideo();
    if (!this.player) console.error('EnhancerForTwitchError: Get video player failed.');
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
