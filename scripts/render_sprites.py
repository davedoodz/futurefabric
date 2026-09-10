"""Run with Blender --background --python scripts/render_sprites.py -- SOURCE OUTPUT [--preview]."""
import bpy
import math
import sys
import json
import re
import unicodedata
from pathlib import Path
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
source, output = map(Path, args[:2])
preview = '--preview' in args
output.mkdir(parents=True, exist_ok=True)

def slug(name):
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', name).strip('-')

files = sorted(source.glob('*.glb'))
only = next((arg.split('=', 1)[1] for arg in args if arg.startswith('--only=')), None)
if only:
    files = [file for file in files if file.stem.lower() == only.lower()]
    if not files:
        raise ValueError(f'No GLB found matching {only}')
if preview:
    files = files[:1]
for file in files:
    target_dir = output / slug(file.stem)
    target_dir.mkdir(exist_ok=True)
    if not preview and len(list(target_dir.glob('frame-*.png'))) == 36:
        print('SKIP COMPLETE', file.name, flush=True)
        continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(file))
    scene = bpy.context.scene
    meshes = [o for o in scene.objects if o.type == 'MESH']
    points = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    low = Vector(tuple(min(p[i] for p in points) for i in range(3)))
    high = Vector(tuple(max(p[i] for p in points) for i in range(3)))
    center = (low + high) / 2
    size = high - low
    scale = max(size)
    radius = math.hypot(size.x, size.y) / 2
    # Fixed framing for every angle prevents breathing and clipping.
    ortho = max(radius * 2, size.z * 1.05 + radius * 0.6) * 1.16
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = ortho
    camera.data.lens = 50
    camera.data.clip_end = scale * 100
    scene.camera = camera

    world = bpy.data.worlds.new('Soft studio')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.8, 0.85, 1, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
    scene.world = world

    def light(name, pos, power, size_factor):
        data = bpy.data.lights.new(name, 'AREA')
        data.energy = power * scale * scale
        data.shape = 'DISK'
        data.size = size_factor * scale
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
        obj.location = center + Vector(pos) * scale
        obj.rotation_euler = (center - obj.location).to_track_quat('-Z', 'Y').to_euler()
    light('Key softbox', (-2, -3, 4), 450, 3)
    light('Fill softbox', (3, -1, 2), 250, 3)
    light('Rim softbox', (0, 3, 3), 400, 2)

    scene.render.engine = 'CYCLES'
    preferences = bpy.context.preferences.addons['cycles'].preferences
    preferences.compute_device_type = 'OPTIX'
    preferences.get_devices()
    for device in preferences.devices:
        device.use = device.type == 'OPTIX'
    scene.cycles.device = 'GPU'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
    scene.cycles.adaptive_threshold = 0.025
    scene.render.use_persistent_data = True
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    scene.view_settings.view_transform = 'AgX'
    for index in range(1 if preview else 36):
        angle = math.radians(-30 + index * 10)
        camera.location = center + Vector((math.sin(angle) * 4 * scale, -math.cos(angle) * 4 * scale, 1.25 * scale))
        camera.rotation_euler = (center - camera.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = str(target_dir / f'frame-{index:02}.png')
        bpy.ops.render.render(write_still=True)
        print(f'FRAME {file.name} {index+1}/36', flush=True)
    (target_dir / ('preview.json' if preview else 'source.json')).write_text(json.dumps({'source': file.name, 'slug': slug(file.stem), 'frames': 1 if preview else 36, 'stepDegrees': 10, 'cameraStartDegrees': -30, 'bounds': list(size)}, indent=2))
