// @flow

import {
    Uniform1f,
    Uniform2fv,
    UniformMatrix4fv,
    Uniforms
} from '../uniform_binding';
import pixelsToTileUnits from '../../source/pixels_to_tile_units';

import type Context from '../../gl/context';
import type {UniformValues} from '../uniform_binding';
import type Transform from '../../geo/transform';
import type Tile from '../../source/tile';

export type CollisionUniformsType = {|
    'u_matrix': UniformMatrix4fv,
    'u_camera_to_center_distance': Uniform1f,
    'u_pixels_to_tile_units': Uniform1f,
    'u_extrude_scale': Uniform2fv,
    'u_overscale_factor': Uniform1f
|};

const collisionUniforms = (context: Context): Uniforms<CollisionUniformsType> => new Uniforms({
    'u_matrix': new UniformMatrix4fv(context),
    'u_camera_to_center_distance': new Uniform1f(context),
    'u_pixels_to_tile_units': new Uniform1f(context),
    'u_extrude_scale': new Uniform2fv(context),
    'u_overscale_factor': new Uniform1f(context)
});

const collisionUniformValues = (
    matrix: Float32Array,
    transform: Transform,
    tile: Tile
): UniformValues<CollisionUniformsType> => {
    const pixelRatio = pixelsToTileUnits(tile, 1, transform.zoom);
    const scale = Math.pow(2, transform.zoom - tile.tileID.overscaledZ);
    const overscaleFactor = tile.tileID.overscaleFactor();
    return {
        'u_matrix': matrix,
        'u_camera_to_center_distance': transform.cameraToCenterDistance,
        'u_pixels_to_tile_units': pixelRatio,
        'u_extrude_scale': [transform.pixelsToGLUnits[0] / (pixelRatio * scale),
            transform.pixelsToGLUnits[1] / (pixelRatio * scale)],
        'u_overscale_factor': overscaleFactor
    };
};

export { collisionUniforms, collisionUniformValues };