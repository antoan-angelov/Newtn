class NtCollisionResolver {
    hasCollision(manifold: NtManifold): boolean {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let a_shape: NtShapeBase = A.shape;
        let b_shape: NtShapeBase = B.shape;
        if (a_shape instanceof NtRectangleShape
                && b_shape instanceof NtRectangleShape) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        } else if (a_shape instanceof NtRectangleShape
                && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.AABBvsCircle(manifold);
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtRectangleShape) {
            manifold.A = B;
            manifold.B = A;
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        return false;
    }
    resolve(manifold: NtManifold) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let relativeVelocity: NtVec2 = NtVec2.subtract(B.velocity, A.velocity);
        let collisionNormal = manifold.normal;
        let velocityAlondNormal: number =
            NtVec2.dotProduct(relativeVelocity, collisionNormal);
        // calculate restitution
        let e: number = Math.min(A.material.restitution, B.material.restitution);

        // calculate impulse scalar
        let j: number = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;

        // apply impulse
        let impulse: NtVec2 = NtVec2.multiply(collisionNormal, j);
        A.apply_impulse(NtVec2.negate(impulse));
        B.apply_impulse(impulse);

        // calculate friction
        // recalculate after normal impulse is applied
        relativeVelocity = NtVec2.subtract(B.velocity, A.velocity);
        let tangent: NtVec2 = (NtVec2.subtract(relativeVelocity,
            NtVec2.multiply(collisionNormal, velocityAlondNormal)));
        tangent.normalize();

        // apply along the friction vector
        let jt: number = -NtVec2.dotProduct(relativeVelocity, tangent);
        jt = jt / (A.inverse_mass + B.inverse_mass);

        // following Coulomb's law, mu is average between the two frictions
        let mu: number = (A.friction + B.friction) / 2;
        let friction_impulse: NtVec2 = new NtVec2();
        if (Math.abs(jt) < j * mu) {
            friction_impulse.setVec(NtVec2.multiply(tangent, jt));
        } else {
            friction_impulse.setVec(NtVec2.multiply(tangent, -j * mu))
        }
        A.velocity.subtract(NtVec2.multiply(friction_impulse, A.inverse_mass));
        B.velocity.add(NtVec2.multiply(friction_impulse, B.inverse_mass));
    }
}
