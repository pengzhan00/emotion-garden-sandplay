"""
情绪花园 — Blender 场景优化 + 渲染脚本
运行: /Applications/Blender.app/Contents/MacOS/blender --background --python render_emotion_garden.py
"""

import bpy
import os
import math

# ===== 路径设置 =====
GLB_PATH = os.path.join(os.path.dirname(bpy.data.filepath) if bpy.data.filepath else os.path.expanduser('~/Documents/hermes-docs/emotion-garden-sandplay'), '情绪花园_沙盘场景.glb')
OUTPUT_DIR = os.path.expanduser('~/Documents/hermes-docs/')
OUTPUT_IMAGE = os.path.join(OUTPUT_DIR, '情绪花园_渲染成品.png')

# 如果没有打开的文件，用绝对路径
if not os.path.exists(GLB_PATH):
    GLB_PATH = os.path.expanduser('~/Documents/hermes-docs/emotion-garden-sandplay/情绪花园_沙盘场景.glb')

print(f"📦 导入 GLB: {GLB_PATH}")

# ===== 1. 清除默认场景 =====
bpy.ops.wm.read_factory_settings(use_empty=True)

# ===== 2. 导入 GLB =====
bpy.ops.import_scene.gltf(filepath=GLB_PATH)

# ===== 3. 设置世界环境（柔和渐变背景） =====
if 'World' not in bpy.data.worlds:
    world = bpy.data.worlds.new('World')
else:
    world = bpy.data.worlds['World']
bpy.context.scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes['Background']
bg_node.inputs[0].default_value = (0.96, 0.94, 0.92, 1.0)  # 暖白
bg_node.inputs[1].default_value = 0.8  # 强度

# ===== 4. 增强材质 =====
# 让所有发光材质在 Blender 中保留 Eevee/Cycles 的发光效果
for mat in bpy.data.materials:
    if mat.node_tree:
        for node in mat.node_tree.nodes:
            if node.type == 'EMISSION':
                # 增强发光强度
                node.inputs[1].default_value = max(node.inputs[1].default_value, 0.5)

# 给地面加一些细纹质感
ground = None
for obj in bpy.data.objects:
    if 'ground' in obj.name.lower() or 'Circle' in obj.name:
        ground = obj
        break

if ground and ground.active_material:
    mat = ground.active_material
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    # 添加一些粗糙度变化
    for node in nodes:
        if node.type == 'BSDF_PRINCIPLED':
            node.inputs['Roughness'].default_value = 0.7
            node.inputs['Metallic'].default_value = 0.0

# ===== 5. 设置照明 =====
# 清除导入的光源，用更专业的布光替换
for obj in list(bpy.data.objects):
    if obj.type == 'LIGHT':
        bpy.data.objects.remove(obj, do_unlink=True)

# 主光 - 暖色从右上
bpy.ops.object.light_add(type='AREA', location=(8, -6, 10))
main_light = bpy.context.active_object
main_light.data.energy = 800
main_light.data.color = (1.0, 0.95, 0.85)
main_light.rotation_euler = (math.radians(45), 0, math.radians(-30))
main_light.data.size = 5

# 辅光 - 冷色从左下
bpy.ops.object.light_add(type='AREA', location=(-6, 5, 6))
fill_light = bpy.context.active_object
fill_light.data.energy = 400
fill_light.data.color = (0.85, 0.9, 1.0)
fill_light.rotation_euler = (math.radians(30), 0, math.radians(40))
fill_light.data.size = 4

# 背光 - 增加轮廓
bpy.ops.object.light_add(type='AREA', location=(0, -8, 8))
rim_light = bpy.context.active_object
rim_light.data.energy = 300
rim_light.data.color = (0.9, 0.85, 1.0)
rim_light.rotation_euler = (math.radians(20), 0, 0)
rim_light.data.size = 6

# ===== 6. 设置相机 =====
bpy.ops.object.camera_add(location=(5, -6, 4.5))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(55), 0, math.radians(40))
bpy.context.scene.camera = cam

# 调整相机参数
cam.data.lens = 35  # 35mm 镜头
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 8

# ===== 7. 渲染设置 =====
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.film_transparent = False

# Cycles 采样
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'

# 输出路径
scene.render.filepath = OUTPUT_IMAGE
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'

print(f"🎯 渲染输出: {OUTPUT_IMAGE}")

# ===== 8. 渲染 =====
bpy.ops.render.render(write_still=True)

print(f"✅ 渲染完成！")
print(f"📸 图片保存至: {OUTPUT_IMAGE}")

# 也保存 Blender 项目文件
BLEND_PATH = os.path.expanduser('~/Documents/hermes-docs/情绪花园_Blender成品.blend')
bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
print(f"📁 Blender 项目保存至: {BLEND_PATH}")
