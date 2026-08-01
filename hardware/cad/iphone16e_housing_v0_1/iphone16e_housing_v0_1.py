"""Fusion 360 helper script for iPhone ESP32-CAM housing v0.1.

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
        components = [('01_phone_back_sled.stl', (0.0, 0.0, 0.0)), ('02_main_board_retainer.stl', (0.0, 0.0, 8.0)), ('03_ovonic_2s_battery_cradle.stl', (3.0, 126.0, 10.0)), ('04_head_board_camera_effect_chamber.stl', (18.0, 4.0, 16.0)), ('06_clear_acrylic_lens_panel_template.stl', (22.0, 10.0, 32.0)), ('07_left_reflective_insert.stl', (20.7, 10.0, 20.0)), ('07_right_reflective_insert.stl', (73.0, 10.0, 20.0)), ('08_acrylic_square_1_template.stl', (38.0, 38.0, 31.0)), ('09_acrylic_square_2_template.stl', (38.0, 52.0, 32.2)), ('10_acrylic_square_3_template.stl', (38.0, 66.0, 33.4))]

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

        ui.messageBox("Imported {} accessible housing components. The preview STL is intentionally skipped to avoid duplicate overlapping geometry.".format(len(components)))
    except Exception:
        if ui:
            ui.messageBox("Housing import failed:\n" + traceback.format_exc())


def stop(context):
    pass
