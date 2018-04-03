class NtCollisionResolver {
    isCollisionLikely(A: NtBody, B: NtBody): boolean {
        return NtCollisionUtils.AABBvsAABB(A, B);
    }
    hasCollision(manifold: NtManifold): boolean {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let a_shape: NtShapeBase = A.shape;
        let b_shape: NtShapeBase = B.shape;
        if (a_shape instanceof NtPolygonShape
                && b_shape instanceof NtPolygonShape) {
            return new NtPolygonPolygonCollision(manifold).hasCollision();
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtCircleShape) {
            return new NtCircleCircleCollision(manifold).hasCollision();
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtPolygonShape) {
            return new NtCirclePolygonCollision(manifold).hasCollision();
        } else if (a_shape instanceof NtPolygonShape
                && b_shape instanceof NtCircleShape) {
            // make it circle first, polygon second
            manifold.A = B;
            manifold.B = A;
            return new NtCirclePolygonCollision(manifold).hasCollision();
        }
        return false;
    }
    resolve(manifold: NtManifold) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let collisionNormal = manifold.normal;
        for(let i = 0; i < manifold.contact_points.length; i++) {
            let contact_point: NtVec2 = manifold.contact_points[i];
            let ra: NtVec2 = NtVec2.subtract(contact_point, A.position);
            let rb: NtVec2 = NtVec2.subtract(contact_point, B.position);
            let relative_vel: NtVec2 = NtVec2.subtract(B.velocity, A.velocity)
                .add(NtVec2.crossProductScalarFirst(rb, B.angular_velocity))
                .subtract(NtVec2.crossProductScalarFirst(ra, A.angular_velocity));
            let velocity_along_normal: number = NtVec2.dotProduct(relative_vel, collisionNormal);
            let ra_length: number = NtVec2.crossProduct(ra, collisionNormal);
            let rb_length: number = NtVec2.crossProduct(rb, collisionNormal);
            let denominator: number = A.inverse_mass + B.inverse_mass
                + ra_length * ra_length * A.inverse_inertia
                + rb_length * rb_length * B.inverse_inertia;
            let collision_context = {
                contact_point, ra, rb, ra_length, rb_length, denominator,
                relative_vel, velocity_along_normal
            };
            // ignore collision if objects are not moving towards each other
            if (velocity_along_normal > 0) {
                return;
            }

            this.apply_impulse(manifold, collision_context);
            this.apply_friction(manifold, collision_context);
            this.prevent_sinking(manifold);
        }
    }

    private prevent_sinking(manifold: NtManifold) {
        let percent: number = 0.2;
        let slop: number = 0.01;
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let inverse_mass_sum: number = A.inverse_mass + B.inverse_mass;
        let penetration_no_slop: number = Math.max(manifold.penetration - slop, 0);
        let correction_magnitude: number = percent * penetration_no_slop / inverse_mass_sum;
        let correction: NtVec2 = NtVec2.multiply(manifold.normal, correction_magnitude);
        A.position.subtract(NtVec2.multiply(correction, A.inverse_mass));
        B.position.add(NtVec2.multiply(correction, B.inverse_mass));
    }

    private apply_impulse(manifold: NtManifold, collision_context: any) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let ra: NtVec2 = collision_context.ra;
        let rb: NtVec2 = collision_context.rb;
        let impulse: NtVec2 =this.get_impulse(manifold, collision_context)
        A.apply_impulse(NtVec2.negate(impulse), NtVec2.rotate(ra, -A.orientation));
        B.apply_impulse(impulse, NtVec2.rotate(rb, -B.orientation));
    }

    private get_impulse(manifold: NtManifold, collision_context: any): NtVec2 {
        let j: number = this.calculate_j(manifold, collision_context);
        return NtVec2.multiply(manifold.normal, j);
    }

    private calculate_j(manifold: NtManifold, collision_context: any): number {
        // restitution
        let e: number = Math.min(manifold.A.material.restitution, manifold.B.material.restitution);
        let j: number = -(1 + e) * collision_context.velocity_along_normal;
        j /= collision_context.denominator;
        j /= manifold.contact_points.length;
        collision_context.j = j;
        return j;
    }

    private apply_friction(manifold: NtManifold, collision_context: any) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let ra: NtVec2 = collision_context.ra;
        let rb: NtVec2 = collision_context.rb;
        let relative_vel: NtVec2 = NtVec2.subtract(B.velocity, A.velocity)
            .add(NtVec2.crossProductScalarFirst(rb, B.angular_velocity))
            .subtract(NtVec2.crossProductScalarFirst(ra, A.angular_velocity));
        let collisionNormal = manifold.normal;
        let tangent: NtVec2 = NtVec2.subtract(relative_vel, NtVec2.multiply(collisionNormal,
            NtVec2.dotProduct(relative_vel, collisionNormal)));
        if (tangent.x == 0 && tangent.y == 0) {
            tangent.set(1, 0);
        } else {
            tangent.normalize();
        }

        collision_context.tangent = tangent;

        // apply along the friction vector
        let friction_impulse: NtVec2 = this.get_friction_impulse(manifold, collision_context);
        A.apply_impulse(NtVec2.negate(friction_impulse), ra);
        B.apply_impulse(friction_impulse, rb);
    }

    private calculate_jt(manifold: NtManifold, collision_context: any) {
        let jt: number = -NtVec2.dotProduct(collision_context.relative_vel,
            collision_context.tangent);
        jt /= collision_context.denominator;
        jt /= manifold.contact_points.length;
        return jt;
    }

    private get_friction_impulse(manifold: NtManifold, collision_context: any) {
        // following Coulomb's law, mu is average between the two frictions
        let mu: number = (manifold.A.friction + manifold.B.friction) / 2;
        let friction_impulse: NtVec2 = new NtVec2();
        let jt: number = this.calculate_jt(manifold, collision_context);
        if (Math.abs(jt) < collision_context.j * mu) {
            friction_impulse.setVec(NtVec2.multiply(collision_context.tangent, jt));
        } else {
            friction_impulse.setVec(NtVec2.multiply(collision_context.tangent,
                -collision_context.j * mu))
        }
        return friction_impulse;
    }
}
