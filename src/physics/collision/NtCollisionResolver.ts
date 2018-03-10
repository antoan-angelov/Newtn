class NtCollisionResolver {
    hasCollision(manifold: NtManifold): boolean {
        let A: NtBase = manifold.A;
        let B: NtBase = manifold.B;
        if (A instanceof NtRectangle && B instanceof NtRectangle) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        }
        return false;
    }
    resolve(manifold: NtManifold) {
        let A: NtBase = manifold.A;
        let B: NtBase = manifold.B;
        let relativeVelocity: NtVec = NtVec.subtract(B.velocity, A.velocity);
        let collisionNormal = manifold.normal;
        let velocityAlondNormal: number =
            NtVec.dotProduct(relativeVelocity, collisionNormal);
        // calculate restitution
        let e: number = Math.min(A.restitution, B.restitution);

        // calculate impulse scalar
        let j: number = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;

        // apply impulse
        let impulse: NtVec = NtVec.multiply(collisionNormal, j);
        A.velocity.subtract(NtVec.multiply(impulse, A.inverse_mass));
        B.velocity.add(NtVec.multiply(impulse, B.inverse_mass));
    }
}
