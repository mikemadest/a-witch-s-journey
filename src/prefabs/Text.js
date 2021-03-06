/**
 *
 **/
export default class Text {
  constructor(ctx, x, y, string, size, origin, fontFamily) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.text = string;
    const padding = 15;
    const w = (0.95 * ctx.CONFIG.width) / ctx.cameras.main.zoom;

    this.style = {
      fontFamily: fontFamily ? fontFamily : "ClickPixel",
      fontSize: size,
      color: "0xFFFFFF",
      align: "center",
      wordWrap: { width: w - padding, useAdvancedWrap: true }
    };
    this.origin = this.initOrigin(origin);
    this.obj = this.createText();
  }

  initOrigin(origin) {
    if (typeof origin === "number") {
      return {
        x: origin,
        y: origin
      };
    } else if (typeof origin === "object") {
      return origin;
    }

    return {
      x: 0.5,
      y: 0.5
    };
  }

  createText() {
    const obj = this.ctx.add.bitmapText(
      this.x,
      this.y,
      this.style.fontFamily,
      this.text,
      this.style.fontSize,
      this.style.align
    );
    obj.setOrigin(this.origin.x, this.origin.y);
    return obj;
  }

  destroy() {
    this.obj.destroy();
    this.obj = null;
  }

  setText(string) {
    this.text = string;
    this.obj.setText(string);
  }

  setX(x) {
    this.x = x;
    this.obj.setX(x);
  }

  setY(y) {
    this.y = y;
    this.obj.setY(y);
  }

  setOrigin(origin) {
    this.origin = this.initOrigin(origin);
    this.obj.setOrigin(origin);
  }

  setDepth(depth) {
    this.obj.setDepth(depth);
  }

  setScrollFactor(scrollX, scrollY) {
    this.obj.setScrollFactor(scrollX, scrollY);
  }

  getCenter() {
    return this.obj.getCenter();
  }

  getTopLeft() {
    return this.obj.getTopLeft();
  }

  getTopRight() {
    return this.obj.getTopRight();
  }
  getBottomLeft() {
    return this.obj.getBottomLeft();
  }

  getBottomRight() {
    return this.obj.getBottomRight();
  }
}
