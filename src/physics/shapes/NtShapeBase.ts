abstract class NtShapeBase {
    private _bounds: NtBounds|null = null;

    abstract calculate_bounds(): NtBounds;

    get bounds() {
        this._bounds = this._bounds || this.calculate_bounds();
        return this._bounds;
    }
}
