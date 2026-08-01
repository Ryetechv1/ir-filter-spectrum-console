from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path


OUT = Path(__file__).resolve().parent
STL_OUT = OUT / "stl"
SVG_OUT = OUT / "housing_assembly_top_view.svg"
FUSION_SCRIPT = OUT / "iphone16e_housing_v0_1.py"
FUSION_IMPORT_SCRIPT = OUT / "fusion360_import_housing_components.py"
README = OUT / "README_HOUSING.md"
MANIFEST = OUT / "housing_manifest.json"


@dataclass(frozen=True)
class Params:
    # Case envelope is intentionally adjustable because case manufacturers do
    # not publish full internal shell geometry. Defaults are sized around the
    # iPhone-class case plus printable wall allowance.
    case_w: float = 76.8
    case_h: float = 151.0
    camera_keepout_w: float = 36.0
    camera_keepout_h: float = 42.0

    main_board_w: float = 70.0
    main_board_h: float = 136.0
    main_board_th: float = 1.6
    main_board_x: float = 3.4
    main_board_y: float = 7.5

    head_board_w: float = 50.0
    head_board_h: float = 90.0
    head_board_th: float = 0.8

    battery_w: float = 61.9
    battery_h: float = 16.3
    battery_t: float = 13.4
    battery_clearance: float = 1.3

    acrylic_w: float = 49.0
    acrylic_h: float = 35.0
    acrylic_t: float = 1.0
    acrylic_slot_clearance: float = 0.45
    acrylic_square_w: float = 18.0
    acrylic_square_h: float = 18.0

    m3_clearance_d: float = 3.2
    m3_boss_od: float = 7.0
    m3_counterbore_d: float = 6.2
    wall: float = 2.0
    floor: float = 2.0
    rail: float = 1.6
    fit_clearance: float = 0.35


P = Params()


ASSEMBLY_OFFSETS_MM = {
    "01_phone_back_sled": (0.0, 0.0, 0.0),
    "02_main_board_retainer": (0.0, 0.0, 8.0),
    "03_ovonic_2s_battery_cradle": (3.0, 126.0, 10.0),
    "04_head_board_camera_effect_chamber": (18.0, 4.0, 16.0),
    "06_clear_acrylic_lens_panel_template": (22.0, 10.0, 32.0),
    "07_left_reflective_insert": (20.7, 10.0, 20.0),
    "07_right_reflective_insert": (73.0, 10.0, 20.0),
    "08_acrylic_square_1_template": (38.0, 38.0, 31.0),
    "09_acrylic_square_2_template": (38.0, 52.0, 32.2),
    "10_acrylic_square_3_template": (38.0, 66.0, 33.4),
}


@dataclass
class Mesh:
    name: str
    triangles: list[tuple[tuple[float, float, float], tuple[float, float, float], tuple[float, float, float]]] = field(default_factory=list)

    def add_tri(self, a, b, c):
        self.triangles.append((a, b, c))

    def bounds(self):
        xs, ys, zs = [], [], []
        for tri in self.triangles:
            for x, y, z in tri:
                xs.append(x)
                ys.append(y)
                zs.append(z)
        return {
            "min": [round(min(xs), 3), round(min(ys), 3), round(min(zs), 3)],
            "max": [round(max(xs), 3), round(max(ys), 3), round(max(zs), 3)],
            "size": [round(max(xs) - min(xs), 3), round(max(ys) - min(ys), 3), round(max(zs) - min(zs), 3)],
        }


def normal(a, b, c):
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    length = math.sqrt(nx * nx + ny * ny + nz * nz)
    if length == 0:
        return 0.0, 0.0, 0.0
    return nx / length, ny / length, nz / length


def write_stl(mesh: Mesh, path: Path):
    with path.open("w", encoding="ascii", newline="\n") as handle:
        handle.write(f"solid {mesh.name}\n")
        for a, b, c in mesh.triangles:
            nx, ny, nz = normal(a, b, c)
            handle.write(f"  facet normal {nx:.6f} {ny:.6f} {nz:.6f}\n")
            handle.write("    outer loop\n")
            for x, y, z in (a, b, c):
                handle.write(f"      vertex {x:.6f} {y:.6f} {z:.6f}\n")
            handle.write("    endloop\n")
            handle.write("  endfacet\n")
        handle.write(f"endsolid {mesh.name}\n")


def add_box(mesh: Mesh, x: float, y: float, z: float, w: float, d: float, h: float):
    x2, y2, z2 = x + w, y + d, z + h
    v = [
        (x, y, z), (x2, y, z), (x2, y2, z), (x, y2, z),
        (x, y, z2), (x2, y, z2), (x2, y2, z2), (x, y2, z2),
    ]
    faces = [
        (0, 2, 1), (0, 3, 2),
        (4, 5, 6), (4, 6, 7),
        (0, 1, 5), (0, 5, 4),
        (1, 2, 6), (1, 6, 5),
        (2, 3, 7), (2, 7, 6),
        (3, 0, 4), (3, 4, 7),
    ]
    for a, b, c in faces:
        mesh.add_tri(v[a], v[b], v[c])


def add_rect_frame(mesh: Mesh, x: float, y: float, z: float, w: float, d: float, h: float, wall: float):
    add_box(mesh, x, y, z, w, wall, h)
    add_box(mesh, x, y + d - wall, z, w, wall, h)
    side_d = d - 2 * wall
    if side_d > 0:
        add_box(mesh, x, y + wall, z, wall, side_d, h)
        add_box(mesh, x + w - wall, y + wall, z, wall, side_d, h)


def add_tube(mesh: Mesh, cx: float, cy: float, z: float, h: float, ro: float, ri: float, segments: int = 48):
    for i in range(segments):
        a0 = 2 * math.pi * i / segments
        a1 = 2 * math.pi * (i + 1) / segments
        o0 = (cx + ro * math.cos(a0), cy + ro * math.sin(a0), z)
        o1 = (cx + ro * math.cos(a1), cy + ro * math.sin(a1), z)
        o2 = (o0[0], o0[1], z + h)
        o3 = (o1[0], o1[1], z + h)
        i0 = (cx + ri * math.cos(a0), cy + ri * math.sin(a0), z)
        i1 = (cx + ri * math.cos(a1), cy + ri * math.sin(a1), z)
        i2 = (i0[0], i0[1], z + h)
        i3 = (i1[0], i1[1], z + h)

        mesh.add_tri(o0, o1, o3)
        mesh.add_tri(o0, o3, o2)
        mesh.add_tri(i0, i3, i1)
        mesh.add_tri(i0, i2, i3)
        mesh.add_tri(o2, o3, i3)
        mesh.add_tri(o2, i3, i2)
        mesh.add_tri(o0, i1, o1)
        mesh.add_tri(o0, i0, i1)


def phone_back_sled() -> Mesh:
    mesh = Mesh("01_phone_back_sled")
    # Split base around the phone camera keepout so the native phone camera is not covered.
    add_box(mesh, P.camera_keepout_w, 0, 0, P.case_w - P.camera_keepout_w, P.camera_keepout_h, P.floor)
    add_box(mesh, 0, P.camera_keepout_h, 0, P.case_w, P.case_h - P.camera_keepout_h, P.floor)

    # Low perimeter lips.
    add_box(mesh, 0, P.camera_keepout_h, P.floor, P.rail, P.case_h - P.camera_keepout_h, 1.8)
    add_box(mesh, P.case_w - P.rail, 0, P.floor, P.rail, P.case_h, 1.8)
    add_box(mesh, 0, P.case_h - P.rail, P.floor, P.case_w, P.rail, 1.8)
    add_box(mesh, P.camera_keepout_w, 0, P.floor, P.case_w - P.camera_keepout_w, P.rail, 1.8)

    # Main PCB M3 bosses, aligned to generated KiCad holes H1/H2/H3 plus board offset.
    for x, y in [(5, 108), (5, 48), (66, 132)]:
        add_tube(mesh, P.main_board_x + x, P.main_board_y + y, P.floor, 5.2, P.m3_boss_od / 2, P.m3_clearance_d / 2)
    return mesh


def main_board_retainer() -> Mesh:
    mesh = Mesh("02_main_board_retainer")
    x, y = P.main_board_x - 0.8, P.main_board_y - 0.8
    w, h = P.main_board_w + 1.6, P.main_board_h + 1.6
    z = 0
    rail_h = 6.2
    add_rect_frame(mesh, x, y, z, w, h, rail_h, P.rail)

    # Keep the phone camera cutout open on the upper-left by adding a beveled-looking stop only on the safe edge.
    add_box(mesh, P.camera_keepout_w + 1.5, 3.0, z, 24.0, 1.6, 4.0)
    for xh, yh in [(5, 108), (5, 48), (66, 132)]:
        add_tube(mesh, P.main_board_x + xh, P.main_board_y + yh, z, 8.0, P.m3_boss_od / 2, P.m3_clearance_d / 2)
        add_tube(mesh, P.main_board_x + xh, P.main_board_y + yh, z + 4.2, 2.0, P.m3_counterbore_d / 2, P.m3_clearance_d / 2)
    return mesh


def battery_cradle() -> Mesh:
    mesh = Mesh("03_ovonic_2s_battery_cradle")
    pocket_w = P.battery_w + 2 * P.battery_clearance
    pocket_h = P.battery_h + 2 * P.battery_clearance
    base_w = pocket_w + 2 * P.wall
    base_h = pocket_h + 2 * P.wall
    z = 0
    add_box(mesh, 0, 0, z, base_w, base_h, P.floor)
    add_rect_frame(mesh, 0, 0, P.floor, base_w, base_h, P.battery_t + 2.0, P.wall)
    # Low internal stops keep the pack from sliding while leaving the top fully open.
    add_box(mesh, P.wall + 8.0, P.wall + 0.7, P.floor, 10.0, 0.9, 2.0)
    add_box(mesh, base_w - P.wall - 18.0, P.wall + 0.7, P.floor, 10.0, 0.9, 2.0)
    add_box(mesh, P.wall + 8.0, base_h - P.wall - 1.6, P.floor, 10.0, 0.9, 2.0)
    add_box(mesh, base_w - P.wall - 18.0, base_h - P.wall - 1.6, P.floor, 10.0, 0.9, 2.0)
    return mesh


def head_camera_chamber() -> Mesh:
    mesh = Mesh("04_head_board_camera_effect_chamber")
    outer_w = 58.0
    outer_h = 114.0
    chamber_h = 14.0
    wall = P.wall
    add_box(mesh, 0, 0, 0, outer_w, outer_h, P.floor)

    # Camera effect chamber above the LED head.
    chamber_y = 0
    chamber_d = 82.0
    add_rect_frame(mesh, 0, chamber_y, P.floor, outer_w, chamber_d, chamber_h, wall)

    # Head PCB slide rails centered under the chamber.
    rail_gap = P.head_board_w + 2 * P.fit_clearance
    rail_x = (outer_w - rail_gap) / 2
    add_box(mesh, rail_x - P.rail, 6.0, P.floor, P.rail, P.head_board_h + 2.0, 4.0)
    add_box(mesh, rail_x + rail_gap, 6.0, P.floor, P.rail, P.head_board_h + 2.0, 4.0)
    add_box(mesh, rail_x - P.rail, 6.0 + P.head_board_h + 2.0, P.floor, rail_gap + 2 * P.rail, P.rail, 4.0)

    # M3 tabs for fastening the chamber to the phone-back sled.
    for cx, cy in [(7.0, 7.0), (outer_w - 7.0, 7.0), (7.0, outer_h - 7.0), (outer_w - 7.0, outer_h - 7.0)]:
        add_tube(mesh, cx, cy, P.floor, 6.0, P.m3_boss_od / 2, P.m3_clearance_d / 2)

    # Acrylic protective lens slide rails, open on the right side for insertion.
    slot_z = P.floor + chamber_h - 2.4
    add_box(mesh, 4.0, 4.0, slot_z, outer_w - 9.5, 1.4, 1.8)
    add_box(mesh, 4.0, chamber_d - 5.4, slot_z, outer_w - 9.5, 1.4, 1.8)
    add_box(mesh, 4.0, 4.0, slot_z + P.acrylic_t + P.acrylic_slot_clearance, outer_w - 9.5, 1.4, 1.0)
    add_box(mesh, 4.0, chamber_d - 5.4, slot_z + P.acrylic_t + P.acrylic_slot_clearance, outer_w - 9.5, 1.4, 1.0)

    # Lens alignment ring around the ESP32-CAM lens center from the head PCB.
    add_tube(mesh, outer_w / 2, 16.0, P.floor, 4.0, 7.2, 4.9, 64)

    # Three vertical acrylic-square zones sit between paired left/right RGBW LEDs.
    square_x = (outer_w - P.acrylic_square_w) / 2
    for index, square_y in enumerate([33.0, 47.0, 61.0], start=1):
        add_box(mesh, square_x - 2.0, square_y - 1.2, P.floor + 4.0, 1.2, P.acrylic_square_h + 2.4, 2.0)
        add_box(mesh, square_x + P.acrylic_square_w + 0.8, square_y - 1.2, P.floor + 4.0, 1.2, P.acrylic_square_h + 2.4, 2.0)
        add_box(mesh, square_x - 2.0, square_y - 1.2, P.floor + 6.0, P.acrylic_square_w + 4.0, 1.0, 1.2)
        add_box(mesh, square_x - 2.0, square_y + P.acrylic_square_h + 0.2, P.floor + 6.0, P.acrylic_square_w + 4.0, 1.0, 1.2)
    return mesh


def acrylic_panel() -> Mesh:
    mesh = Mesh("06_clear_acrylic_lens_panel_template")
    add_box(mesh, 0, 0, 0, P.acrylic_w, P.acrylic_h, P.acrylic_t)
    return mesh


def acrylic_square_template(index: int) -> Mesh:
    mesh = Mesh(f"{7 + index:02d}_acrylic_square_{index}_template")
    add_box(mesh, 0, 0, 0, P.acrylic_square_w, P.acrylic_square_h, P.acrylic_t)
    return mesh


def reflector_insert(side: str) -> Mesh:
    mesh = Mesh(f"07_{side}_reflective_insert")
    # Clean flat backing strip; apply chrome/mylar tape to the inward face.
    add_box(mesh, 0, 0, 0, 1.0, 37.5, 10.8)
    if side == "right":
        mesh.triangles = [tuple((-x + 1.0, y, z) for x, y, z in tri) for tri in mesh.triangles]
    return mesh


def add_mesh_with_offset(target: Mesh, source: Mesh, offset: tuple[float, float, float]):
    ox, oy, oz = offset
    for tri in source.triangles:
        target.add_tri(*[(x + ox, y + oy, z + oz) for x, y, z in tri])


def assembly_preview() -> Mesh:
    mesh = Mesh("00_housing_all_parts_preview")
    source_meshes = {
        "01_phone_back_sled": phone_back_sled(),
        "02_main_board_retainer": main_board_retainer(),
        "03_ovonic_2s_battery_cradle": battery_cradle(),
        "04_head_board_camera_effect_chamber": head_camera_chamber(),
        "06_clear_acrylic_lens_panel_template": acrylic_panel(),
        "07_left_reflective_insert": reflector_insert("left"),
        "07_right_reflective_insert": reflector_insert("right"),
        "08_acrylic_square_1_template": acrylic_square_template(1),
        "09_acrylic_square_2_template": acrylic_square_template(2),
        "10_acrylic_square_3_template": acrylic_square_template(3),
    }
    for name, source in source_meshes.items():
        add_mesh_with_offset(mesh, source, ASSEMBLY_OFFSETS_MM[name])
    return mesh


def write_acrylic_svg():
    path = OUT / "acrylic_lens_panel_template_1mm.svg"
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{P.acrylic_w}mm" height="{P.acrylic_h}mm" viewBox="0 0 {P.acrylic_w} {P.acrylic_h}">
  <rect x="0.25" y="0.25" width="{P.acrylic_w - 0.5}" height="{P.acrylic_h - 0.5}" rx="1.5" ry="1.5" fill="none" stroke="#000" stroke-width="0.2"/>
  <text x="2" y="{P.acrylic_h - 2.5}" font-family="Arial" font-size="2.5">1.0 mm clear acrylic protective lens</text>
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def write_top_view_svg():
    scale = 4.2
    width = P.case_w * scale + 120
    height = P.case_h * scale + 70

    def sx(x):
        return 40 + x * scale

    def sy(y):
        return 35 + y * scale

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width:.0f}" height="{height:.0f}" viewBox="0 0 {width:.0f} {height:.0f}">
  <rect width="100%" height="100%" fill="#07111f"/>
  <text x="28" y="24" fill="#e5f0ff" font-family="Arial" font-size="16" font-weight="700">iPhone case housing v0.1 top-view assembly reference</text>
  <rect x="{sx(0):.1f}" y="{sy(0):.1f}" width="{P.case_w*scale:.1f}" height="{P.case_h*scale:.1f}" rx="18" fill="#152638" stroke="#8ab7d4" stroke-width="2"/>
  <rect x="{sx(0):.1f}" y="{sy(0):.1f}" width="{P.camera_keepout_w*scale:.1f}" height="{P.camera_keepout_h*scale:.1f}" rx="9" fill="#07111f" stroke="#f5d06b" stroke-width="2"/>
  <text x="{sx(3):.1f}" y="{sy(24):.1f}" fill="#f5d06b" font-family="Arial" font-size="10">phone camera keepout</text>
  <rect x="{sx(P.main_board_x):.1f}" y="{sy(P.main_board_y):.1f}" width="{P.main_board_w*scale:.1f}" height="{P.main_board_h*scale:.1f}" fill="#0a6b73" fill-opacity="0.45" stroke="#42d9ff" stroke-width="2"/>
  <text x="{sx(P.main_board_x+4):.1f}" y="{sy(P.main_board_y+78):.1f}" fill="#dff7ff" font-family="Arial" font-size="12">main PCB bay</text>
  <rect x="{sx(21):.1f}" y="{sy(112):.1f}" width="{(P.battery_w+2*P.battery_clearance)*scale:.1f}" height="{(P.battery_h+2*P.battery_clearance)*scale:.1f}" rx="4" fill="#252f3a" stroke="#b9c7d6" stroke-width="2"/>
  <text x="{sx(23):.1f}" y="{sy(124):.1f}" fill="#eaf2f8" font-family="Arial" font-size="10">2S LiPo pocket</text>
  <rect x="{sx(18):.1f}" y="{sy(4):.1f}" width="{58*scale:.1f}" height="{114*scale:.1f}" rx="5" fill="#193143" fill-opacity="0.7" stroke="#71d8ff" stroke-width="2"/>
  <rect x="{sx(24):.1f}" y="{sy(10):.1f}" width="{49*scale:.1f}" height="{35*scale:.1f}" fill="none" stroke="#ffffff" stroke-dasharray="5 3" stroke-width="1.5"/>
  <text x="{sx(60):.1f}" y="{sy(20):.1f}" fill="#ffffff" font-family="Arial" font-size="9">slide-in acrylic</text>
  <rect x="{sx(38):.1f}" y="{sy(38):.1f}" width="{P.acrylic_square_w*scale:.1f}" height="{P.acrylic_square_h*scale:.1f}" fill="none" stroke="#a5b4fc" stroke-dasharray="4 3" stroke-width="1.3"/>
  <rect x="{sx(38):.1f}" y="{sy(52):.1f}" width="{P.acrylic_square_w*scale:.1f}" height="{P.acrylic_square_h*scale:.1f}" fill="none" stroke="#a5b4fc" stroke-dasharray="4 3" stroke-width="1.3"/>
  <rect x="{sx(38):.1f}" y="{sy(66):.1f}" width="{P.acrylic_square_w*scale:.1f}" height="{P.acrylic_square_h*scale:.1f}" fill="none" stroke="#a5b4fc" stroke-dasharray="4 3" stroke-width="1.3"/>
  <text x="{sx(58):.1f}" y="{sy(57):.1f}" fill="#c7d2fe" font-family="Arial" font-size="9">3 acrylic RGBW zones</text>
</svg>
"""
    SVG_OUT.write_text(svg, encoding="utf-8")


def write_fusion_script(component_entries: list[tuple[str, tuple[float, float, float]]]):
    script = f'''"""Fusion 360 helper script for iPhone ESP32-CAM housing v0.1.

Run from Fusion 360: Utilities > Scripts and Add-Ins > Add script, then select
this file. It imports each generated STL as a separate mesh body/component.
For editable solids, right-click each mesh body in Fusion and use Mesh > Convert
Mesh after confirming the print-fit dimensions.
"""

import os
import traceback


def run(context):
    import adsk.core
    import adsk.fusion

    app = adsk.core.Application.get()
    ui = app.userInterface
    try:
        doc = app.documents.add(adsk.core.DocumentTypes.FusionDesignDocumentType)
        design = adsk.fusion.Design.cast(app.activeProduct)
        design.designType = adsk.fusion.DesignTypes.DirectDesignType
        root = design.rootComponent
        script_dir = os.path.dirname(os.path.abspath(__file__))
        stl_dir = os.path.join(script_dir, "stl")
        components = {component_entries!r}

        for filename, offset_mm in components:
            path = os.path.join(stl_dir, filename)
            if not os.path.exists(path):
                raise RuntimeError("Missing STL: " + path)
            matrix = adsk.core.Matrix3D.create()
            matrix.translation = adsk.core.Vector3D.create(offset_mm[0] / 10.0, offset_mm[1] / 10.0, offset_mm[2] / 10.0)
            occurrence = root.occurrences.addNewComponent(matrix)
            display_name = os.path.splitext(filename)[0]
            occurrence.name = display_name
            component = occurrence.component
            component.name = display_name

            mesh_bodies = component.meshBodies.add(path, adsk.fusion.MeshUnits.MillimeterMeshUnit)
            if mesh_bodies is None or mesh_bodies.count == 0:
                raise RuntimeError("Fusion failed to import STL: " + path)
            for index in range(mesh_bodies.count):
                mesh_bodies.item(index).name = display_name + "_mesh"

        ui.messageBox("Imported {{}} accessible housing components. The preview STL is intentionally skipped to avoid duplicate overlapping geometry.".format(len(components)))
    except Exception:
        if ui:
            ui.messageBox("Housing import failed:\\n" + traceback.format_exc())


def stop(context):
    pass
'''
    FUSION_SCRIPT.write_text(script, encoding="utf-8")
    FUSION_IMPORT_SCRIPT.write_text(script, encoding="utf-8")


def write_readme(manifest: dict):
    README.write_text(
        f"""# iPhone ESP32-CAM Housing v0.1

This CAD package is generated for the current electronics stack:

- Main PCB v0.8: 70.0 x 136.0 mm
- LED/camera head PCB v0.8: 50.0 x 90.0 mm
- OVONIC 2S LiPo: 61.9 x 16.3 x 13.4 mm, pocket modeled at {P.battery_w + 2 * P.battery_clearance:.1f} x {P.battery_h + 2 * P.battery_clearance:.1f} x {P.battery_t + 2.0:.1f} mm
- Protective acrylic panel: {P.acrylic_w:.1f} x {P.acrylic_h:.1f} x {P.acrylic_t:.1f} mm
- Three RGBW-lit acrylic squares: {P.acrylic_square_w:.1f} x {P.acrylic_square_h:.1f} x {P.acrylic_t:.1f} mm each

## Parts

The `stl/` folder contains separate printable/importable parts:

- `01_phone_back_sled.stl`: case-backed sled with phone camera keepout and M3 bosses.
- `02_main_board_retainer.stl`: low retainer frame for the main PCB.
- `03_ovonic_2s_battery_cradle.stl`: open-top battery pocket with internal anti-slide stops.
- `04_head_board_camera_effect_chamber.stl`: head-board chamber with acrylic slide rails, lens ring, and M3 tabs.
- `06_clear_acrylic_lens_panel_template.stl`: 1 mm acrylic reference part.
- `07_left_reflective_insert.stl` and `07_right_reflective_insert.stl`: optional flat chamber side reflector backers.
- `08_acrylic_square_1_template.stl`, `09_acrylic_square_2_template.stl`, and `10_acrylic_square_3_template.stl`: clear square acrylic templates for the three independently lit RGBW zones.
- `00_housing_all_parts_preview.stl`: non-print assembly preview. It is not imported by the Fusion script because it would duplicate the real components.

## Fusion 360

Use `iphone16e_housing_v0_1.py` in Autodesk Fusion 360 to import the generated STLs as separate named mesh components. `fusion360_import_housing_components.py` is kept as a descriptive duplicate. The script skips the preview STL and places the printable parts at their assembly offsets so each component stays accessible from the Fusion browser.

## Screw Hardware

- Use M3 hex-socket screws.
- Modeled clearance holes: {P.m3_clearance_d:.1f} mm.
- Modeled boss OD: {P.m3_boss_od:.1f} mm.
- Modeled cap-head/counterbore reference: {P.m3_counterbore_d:.1f} mm.
- Start with M3 x 6 mm for covers/retainers and M3 x 8 mm where the chamber stack needs more bite.

## Print-Fit Notes

- Print the sled and chamber at 1:1 before final fabrication. The Speck/FarmingtonSpeck case camera opening is not published as a dimensional drawing.
- The v0.8 main PCB is almost the same width as the phone body, so the housing uses shallow retainer rails instead of thick full-width side walls.
- The v0.8 head board is taller to hold six added RGBW edge LEDs. Confirm that the three acrylic-square slots line up with D5-D10 before final print.
- The clear acrylic slot is modeled with {P.acrylic_slot_clearance:.2f} mm total clearance around 1.0 mm sheet. Adjust if your acrylic is laser-cut oversized.
- The side reflector inserts are plastic backing strips. Apply mirror mylar, chrome vinyl, or polished foil to the inward face.
- Keep UVA/IR leakage contained; use black opaque filament for the chamber body and only use clear acrylic at the intended protective lens.

## Generated Bounds

```json
{json.dumps(manifest, indent=2)}
```
""",
        encoding="utf-8",
    )


def main():
    STL_OUT.mkdir(parents=True, exist_ok=True)
    parts = [
        phone_back_sled(),
        main_board_retainer(),
        battery_cradle(),
        head_camera_chamber(),
        acrylic_panel(),
        reflector_insert("left"),
        reflector_insert("right"),
        acrylic_square_template(1),
        acrylic_square_template(2),
        acrylic_square_template(3),
        assembly_preview(),
    ]

    manifest: dict[str, dict] = {}
    stl_names = []
    for mesh in parts:
        filename = f"{mesh.name}.stl"
        stl_names.append(filename)
        path = STL_OUT / filename
        write_stl(mesh, path)
        manifest[filename] = {
            "triangles": len(mesh.triangles),
            "bounds_mm": mesh.bounds(),
        }

    component_entries = []
    for filename in stl_names:
        stem = filename[:-4] if filename.endswith(".stl") else filename
        if stem in ASSEMBLY_OFFSETS_MM:
            component_entries.append((filename, ASSEMBLY_OFFSETS_MM[stem]))

    write_acrylic_svg()
    write_top_view_svg()
    write_fusion_script(component_entries)
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    write_readme(manifest)
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
