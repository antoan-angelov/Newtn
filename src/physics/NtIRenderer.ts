interface NtIRenderer {
    canvas: CanvasRenderingContext2D;
    draw():void;
    add(object: NtBody):void;
    remove(object: NtBody):void;
}
