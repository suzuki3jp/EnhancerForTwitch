export class VolumeOverlay {
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
    e.style.height = '5%';
    e.style.width = '100%';
    e.style.textAlign = 'center';
    e.style.verticalAlign = 'middle';
    e.style.fontSize = '25px';
    return e;
  }
}
