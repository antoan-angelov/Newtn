class NtMouseJoint implements NtIJoint {
    private mouse_position: NtVec2 = new NtVec2();
    private point_local: NtVec2 = new NtVec2();
    private dragged_body: NtBody|null = null;

    resolve() {
        if (!this.dragged_body) {
            return;
        }
        let global_source: NtVec2 = NtVec2.add(
            NtVec2.rotate(this.point_local, this.dragged_body.orientation), this.dragged_body.position);
        let target_velocity: NtVec2 = new NtVec2().fromVec(this.mouse_position);
        target_velocity.subtract(global_source);
        target_velocity.subtract(this.dragged_body.velocity);
        this.dragged_body.angular_velocity = 0;
        let target_impulse: NtVec2 = NtVec2.multiply(target_velocity, this.dragged_body.mass);
        this.dragged_body.apply_impulse(target_impulse, this.point_local);
    }

    mouse_down(point: NtVec2) {
        this.dragged_body = world.body_under_point(point);
        this.mouse_position.setVec(point);
        if (this.dragged_body != null) {
            this.point_local = NtVec2.rotate(NtVec2.subtract(point, this.dragged_body.position),
                -this.dragged_body.orientation);
        }
    }

    mouse_move(point: NtVec2) {
        if (!this.dragged_body) {
            return;
        }
        this.mouse_position.setVec(point);
    }

    mouse_up() {
        this.dragged_body = null;
    }
}
