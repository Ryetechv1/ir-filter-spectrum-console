from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

import pcbnew


OUT = Path(__file__).resolve().parent / "iphone16e_2s_sk6812_two_board_v0_8"

BOARDS = [
    ("iphone16e_2s_sk6812_main_v0_8", "main"),
    ("esp32_cam_led_head_v0_8", "head"),
]

EXCLUDE_FROM_ASSEMBLY_PREFIXES = ("H", "P")

NOTES = {
    "J1": {
        "main": "ESP32-CAM left 1x08 socket/header, hand solder unless fab supports THT assembly",
        "head": "14-pin JST-GH 1.25 mm locking wire-harness connector to main board",
    },
    "J2": {
        "main": "ESP32-CAM right 1x08 socket/header, hand solder unless fab supports THT assembly",
    },
    "J3": {"main": "USB-UART upload header: GND, 5V, adapter TX, adapter RX"},
    "J4": {"main": "Arduino Nano left socket/header, hand solder unless fab supports THT assembly"},
    "J5": {"main": "Arduino Nano right socket/header, hand solder unless fab supports THT assembly"},
    "J8": {"main": "14-pin JST-GH 1.25 mm locking wire-harness connector to LED head board"},
    "JP1": {"main": "ESP32-CAM boot jumper; short IO0 to GND only while uploading"},
    "Q1": {"main": "Logic-level NMOS for IR LED low-side PWM"},
    "Q2": {"main": "Logic-level NMOS for UVA LED low-side PWM"},
    "R1": {"main": "IR current limit from 5V, about 35 mA with 1.5V Vf"},
    "R4": {"main": "UVA current limit from 5V, about 21 mA with 3.6V Vf"},
    "R7": {"main": "SK6812 RGBW data series resistor before inter-board harness"},
    "R8": {"main": "Nano D4 to ESP32-CAM RX divider high side"},
    "R9": {"main": "Nano D4 to ESP32-CAM RX divider low side"},
    "R10": {"main": "ESP32-CAM GPIO14 to Nano D2 series resistor"},
    "C1": {"head": "Bulk capacitor across regulated 5V LED rail"},
    "C2": {"head": "Local LED rail bypass capacitor"},
    "D1": {"head": "950 nm 5 mm IR LED, verify vendor polarity before assembly"},
    "D2": {"head": "375 nm 5 mm UVA LED, verify vendor polarity and use UV shielding"},
    "D3": {"head": "SK6812 RGBW 5 mm LED 1 right of lens; verify exact vendor pinout"},
    "D4": {"head": "SK6812 RGBW 5 mm LED 2 left of lens; verify exact vendor pinout"},
    "D5": {"head": "SK6812 acrylic zone 1 left edge LED; verify exact vendor pinout"},
    "D6": {"head": "SK6812 acrylic zone 1 right edge LED; verify exact vendor pinout"},
    "D7": {"head": "SK6812 acrylic zone 2 left edge LED; verify exact vendor pinout"},
    "D8": {"head": "SK6812 acrylic zone 2 right edge LED; verify exact vendor pinout"},
    "D9": {"head": "SK6812 acrylic zone 3 left edge LED; verify exact vendor pinout"},
    "D10": {"head": "SK6812 acrylic zone 3 right edge LED; verify exact vendor pinout"},
}


def natural_key(ref: str) -> tuple[str, int]:
    letters = "".join(ch for ch in ref if not ch.isdigit())
    digits = "".join(ch for ch in ref if ch.isdigit())
    return letters, int(digits or 0)


def layer_name(board: pcbnew.BOARD, footprint: pcbnew.FOOTPRINT) -> str:
    return "Bottom" if footprint.GetLayer() == pcbnew.B_Cu else "Top"


def assembly_type(footprint: pcbnew.FOOTPRINT) -> str:
    attrs = int(footprint.GetAttributes())
    if attrs & int(pcbnew.FP_SMD):
        return "SMT"
    if attrs & int(pcbnew.FP_THROUGH_HOLE):
        return "THT"
    return "Other"


def is_assembly_part(ref: str) -> bool:
    return not ref.startswith(EXCLUDE_FROM_ASSEMBLY_PREFIXES)


def fp_name(footprint: pcbnew.FOOTPRINT) -> str:
    return str(footprint.GetFPID().GetLibItemName())


def rows_for_board(board_name: str, board_label: str):
    board = pcbnew.LoadBoard(str(OUT / f"{board_name}.kicad_pcb"))
    rows = []
    for fp in sorted(board.GetFootprints(), key=lambda f: natural_key(f.GetReference())):
        ref = str(fp.GetReference())
        if not is_assembly_part(ref):
            continue
        pos = fp.GetPosition()
        rows.append(
            {
                "Designator": ref,
                "Comment": str(fp.GetValue()),
                "Footprint": fp_name(fp),
                "Mid X": f"{pcbnew.ToMM(pos.x):.3f}",
                "Mid Y": f"{-pcbnew.ToMM(pos.y):.3f}",
                "Layer": layer_name(board, fp),
                "Rotation": f"{fp.GetOrientationDegrees():.3f}",
                "Assembly Type": assembly_type(fp),
                "LCSC Part #": "",
                "Notes": NOTES.get(ref, {}).get(board_label, ""),
            }
        )
    return rows


def write_cpl(board_name: str, rows: list[dict[str, str]]):
    path = OUT / f"{board_name}_CPL.csv"
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["Designator", "Mid X", "Mid Y", "Layer", "Rotation"])
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row[key] for key in writer.fieldnames})
    return path


def write_smt_cpl(board_name: str, rows: list[dict[str, str]]):
    path = OUT / f"{board_name}_CPL_SMT_ONLY.csv"
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["Designator", "Mid X", "Mid Y", "Layer", "Rotation"])
        writer.writeheader()
        for row in rows:
            if row["Assembly Type"] == "SMT":
                writer.writerow({key: row[key] for key in writer.fieldnames})
    return path


def write_bom(board_name: str, rows: list[dict[str, str]]):
    grouped = defaultdict(list)
    for row in rows:
        key = (
            row["Comment"],
            row["Footprint"],
            row["Layer"],
            row["Assembly Type"],
            row["LCSC Part #"],
            row["Notes"],
        )
        grouped[key].append(row["Designator"])

    path = OUT / f"{board_name}_BOM.csv"
    fieldnames = [
        "Comment",
        "Designator",
        "Footprint",
        "Quantity",
        "Layer",
        "Assembly Type",
        "LCSC Part #",
        "Notes",
    ]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for key, designators in sorted(grouped.items(), key=lambda item: natural_key(item[1][0])):
            comment, footprint, layer, assy, lcsc, notes = key
            writer.writerow(
                {
                    "Comment": comment,
                    "Designator": ",".join(sorted(designators, key=natural_key)),
                    "Footprint": footprint,
                    "Quantity": len(designators),
                    "Layer": layer,
                    "Assembly Type": assy,
                    "LCSC Part #": lcsc,
                    "Notes": notes,
                }
            )
    return path


def main():
    written = []
    for board_name, board_label in BOARDS:
        rows = rows_for_board(board_name, board_label)
        written.append(write_bom(board_name, rows))
        written.append(write_cpl(board_name, rows))
        written.append(write_smt_cpl(board_name, rows))
    for path in written:
        print(path)


if __name__ == "__main__":
    main()
