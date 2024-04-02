import { Element } from './Element';

/**
 * ボリュームをスクロールで変更したときにオーバーレイで現在のボリュームを表示するためのクラス
 */
export class VolumeOverlay {
  private overlay: HTMLDivElement | null;
  private target = new Element<HTMLDivElement>('.click-handler');
  constructor() {
    this.overlay = this.createOverlay();
    this.putOverlay();
  }

  public changeText(volume: number | string) {
    if (this.overlay) {
      this.overlay.textContent = String(Math.floor(Number(volume)));
    } else {
      this.overlay = this.createOverlay();
      this.putOverlay();
    }
  }

  private putOverlay() {
    if (!this.overlay) return;
    this.target.element.appendChild(this.overlay);
  }

  public showOverlay() {
    if (!this.overlay) return;
    this.overlay.style.display = 'table-cell';
  }

  public hideOverlay() {
    if (!this.overlay) return;
    this.overlay.style.display = 'none';
  }

  private createOverlay(defaultValue: number | string = 0): HTMLDivElement | null {
    if (!this.target.element) return null;

    this.target.element.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.textContent = String(defaultValue);
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.display = 'none';
    overlay.style.height = '5%';
    overlay.style.width = '100%';
    overlay.style.textAlign = 'center';
    overlay.style.verticalAlign = 'middle';
    overlay.style.fontSize = '1.3vw';
    overlay.style.userSelect = 'none';
    return overlay;
  }
}
