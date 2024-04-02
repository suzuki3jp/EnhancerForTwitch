/**
 * エレメントを管理するクラス
 * このクラスでエレメントがロードされる前に拡張機能が実行され、取得に失敗し、それ以降の処理でエラーが発生する問題を回避する。
 * 指定秒数インターバルで定期的に取得を実行する
 */
export class Element<E extends HTMLElement> {
  public element: E | null;

  constructor(
    private query: string,
    private options: ElementOptions = {},
  ) {
    this.element = this.getElement();
    if (this.options.interval < 0) return;
    setInterval(() => {
      this.element = this.getElement();
    }, this.options.interval ?? 1_000);
  }

  getElement(): E | null {
    return document.querySelector(this.query);
  }
}

export interface ElementOptions {
  /**
   * 定期取得のインターバルの秒数。
   * デフォルトは1秒
   * 負の値に設定された場合、定期取得を実行せず、初回のみにする。
   */
  interval?: number;
}
