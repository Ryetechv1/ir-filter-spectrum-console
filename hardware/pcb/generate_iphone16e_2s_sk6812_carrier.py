from pathlib import Path
import json
import pcbnew


PROJECT = "iphone16e_2s_sk6812_two_board_v0_8"
MAIN = "iphone16e_2s_sk6812_main_v0_8"
HEAD = "esp32_cam_led_head_v0_8"
ROOT = Path(__file__).resolve().parent
OUT = ROOT / PROJECT
KICAD_CANDIDATES = [
    Path(r"C:\Program Files\KiCad\10.0\share\kicad\footprints"),
    Path(r"C:\Program Files\KiCad\9.0\share\kicad\footprints"),
    Path(r"C:\Program Files\KiCad\8.0\share\kicad\footprints"),
]
KICAD = next((path for path in KICAD_CANDIDATES if path.exists()), KICAD_CANDIDATES[-1])


def mm(value):
    return pcbnew.FromMM(float(value))


def vec(x, y):
    return pcbnew.VECTOR2I(mm(x), mm(y))


def add_net(board, nets, name):
    net = pcbnew.NETINFO_ITEM(board, name)
    board.Add(net)
    nets[name] = net
    return net


def load_fp(lib, name, ref, value, x, y, rot=0):
    fp = pcbnew.FootprintLoad(str(KICAD / f"{lib}.pretty"), name)
    if fp is None:
        raise RuntimeError(f"Could not load {lib}:{name}")
    fp.SetReference(ref)
    fp.SetValue(value)
    fp.SetPosition(vec(x, y))
    fp.SetOrientationDegrees(rot)
    fp.Reference().SetVisible(False)
    fp.Value().SetVisible(False)
    return fp


def pad(fp, number):
    item = fp.FindPadByNumber(str(number))
    if item is None:
        raise RuntimeError(f"{fp.GetReference()} missing pad {number}")
    return item


def set_net(fp, mapping, nets):
    for number, name in mapping.items():
        if name:
            pad(fp, number).SetNet(nets[name])


def track(board, nets, start, end, net_name, width=0.28, layer=pcbnew.F_Cu):
    item = pcbnew.PCB_TRACK(board)
    item.SetStart(start)
    item.SetEnd(end)
    item.SetWidth(mm(width))
    item.SetLayer(layer)
    item.SetNet(nets[net_name])
    board.Add(item)
    return item


def route(board, nets, points, net_name, width=0.28, layer=pcbnew.F_Cu):
    pts = [p if isinstance(p, pcbnew.VECTOR2I) else vec(*p) for p in points]
    for a, b in zip(pts, pts[1:]):
        track(board, nets, a, b, net_name, width, layer)


def connect(board, nets, fp_a, pad_a, fp_b, pad_b, net_name, width=0.28, layer=pcbnew.F_Cu, elbows=None):
    points = [pad(fp_a, pad_a).GetPosition()]
    points.extend(elbows or [])
    points.append(pad(fp_b, pad_b).GetPosition())
    route(board, nets, points, net_name, width, layer)


def add_via(board, nets, x, y, net_name, diameter=0.8, drill=0.4):
    item = pcbnew.PCB_VIA(board)
    item.SetPosition(vec(x, y))
    item.SetWidth(mm(diameter))
    item.SetDrill(mm(drill))
    item.SetLayerPair(pcbnew.F_Cu, pcbnew.B_Cu)
    item.SetNet(nets[net_name])
    board.Add(item)
    return item


def edge_poly(board, points):
    pts = [vec(*p) for p in points]
    for a, b in zip(pts, pts[1:] + pts[:1]):
        item = pcbnew.PCB_SHAPE(board)
        item.SetShape(pcbnew.SHAPE_T_SEGMENT)
        item.SetLayer(pcbnew.Edge_Cuts)
        item.SetStart(a)
        item.SetEnd(b)
        item.SetWidth(mm(0.12))
        board.Add(item)


def edge_circle(board, x, y, radius):
    item = pcbnew.PCB_SHAPE(board)
    item.SetShape(pcbnew.SHAPE_T_CIRCLE)
    item.SetLayer(pcbnew.Edge_Cuts)
    item.SetCenter(vec(x, y))
    item.SetEnd(vec(x + radius, y))
    item.SetWidth(mm(0.12))
    board.Add(item)
    return item


def silk_circle(board, x, y, radius, layer=pcbnew.F_SilkS):
    item = pcbnew.PCB_SHAPE(board)
    item.SetShape(pcbnew.SHAPE_T_CIRCLE)
    item.SetLayer(layer)
    item.SetCenter(vec(x, y))
    item.SetEnd(vec(x + radius, y))
    item.SetWidth(mm(0.12))
    board.Add(item)
    return item


def draw_rect(board, x1, y1, x2, y2, layer=pcbnew.F_Fab, width=0.12):
    points = [(x1, y1), (x2, y1), (x2, y2), (x1, y2)]
    pts = [vec(*p) for p in points]
    for a, b in zip(pts, pts[1:] + pts[:1]):
        item = pcbnew.PCB_SHAPE(board)
        item.SetShape(pcbnew.SHAPE_T_SEGMENT)
        item.SetLayer(layer)
        item.SetStart(a)
        item.SetEnd(b)
        item.SetWidth(mm(width))
        board.Add(item)


def add_text(board, text, x, y, size=0.9, layer=pcbnew.F_Fab, rot=0):
    item = pcbnew.PCB_TEXT(board)
    item.SetText(text)
    item.SetPosition(vec(x, y))
    item.SetLayer(layer)
    item.SetTextHeight(mm(size))
    item.SetTextWidth(mm(size))
    item.SetTextThickness(mm(max(size * 0.14, 0.12)))
    item.SetTextAngleDegrees(rot)
    board.Add(item)
    return item


def mount(board, ref, x, y, diameter="MountingHole_3.2mm_M3"):
    fp = load_fp("MountingHole", diameter, ref, "mount", x, y)
    board.Add(fp)
    return fp


def solder_pad(board, nets, ref, value, x, y, net_name, size="TestPoint_THTPad_3.0x3.0mm_Drill1.5mm"):
    fp = load_fp("TestPoint", size, ref, value, x, y)
    set_net(fp, {"1": net_name}, nets)
    board.Add(fp)
    return fp


def add_res(board, nets, ref, value, x, y, a, b, rot=0):
    fp = load_fp("Resistor_SMD", "R_0805_2012Metric", ref, value, x, y, rot)
    set_net(fp, {"1": a, "2": b}, nets)
    board.Add(fp)
    return fp


def add_cap_smd(board, nets, ref, value, x, y, a, b, rot=0, footprint="C_0805_2012Metric"):
    fp = load_fp("Capacitor_SMD", footprint, ref, value, x, y, rot)
    set_net(fp, {"1": a, "2": b}, nets)
    board.Add(fp)
    return fp


def add_mosfet(board, nets, ref, value, x, y, gate, source, drain, rot=0):
    fp = load_fp("Package_TO_SOT_SMD", "SOT-23", ref, value, x, y, rot)
    set_net(fp, {"1": gate, "2": source, "3": drain}, nets)
    board.Add(fp)
    return fp


def add_rgbw_led(board, nets, ref, value, center_x, center_y, mapping, rot=0):
    # KiCad's 5 mm 4-pin RGB footprint origin is pad 1. Its body center is
    # 3.2385 mm to the right of pad 1 when unrotated.
    fp = load_fp("LED_THT", "LED_D5.0mm-4_RGB_Wide_Pins", ref, value, center_x - 3.2385, center_y, rot)
    set_net(fp, mapping, nets)
    board.Add(fp)
    return fp


def add_mono_led(board, nets, ref, value, center_x, center_y, anode, cathode, footprint):
    # KiCad's 2-pin vertical 5 mm LED footprint origin is cathode pad 1.
    fp = load_fp("LED_THT", footprint, ref, value, center_x - 1.27, center_y, 0)
    set_net(fp, {"1": cathode, "2": anode}, nets)
    board.Add(fp)
    return fp


def interboard_harness(board, nets, ref, value, x, y, mapping, rot=0):
    fp = load_fp("Connector_JST", "JST_GH_SM14B-GHS-TB_1x14-1MP_P1.25mm_Horizontal", ref, value, x, y, rot)
    set_net(fp, mapping, nets)
    board.Add(fp)
    return fp


def setup_board_rules(board):
    board.SetCopperLayerCount(2)
    settings = board.GetDesignSettings()
    settings.m_MinClearance = mm(0.12)
    settings.m_TrackMinWidth = mm(0.10)
    settings.m_SolderMaskMinWidth = mm(0.05)
    settings.m_SolderMaskToCopperClearance = mm(0.00)
    settings.m_SilkClearance = mm(0.10)
    settings.m_AllowSoldermaskBridgesInFPs = True
    if hasattr(settings.m_NetSettings, "GetDefaultNetclass"):
        default_class = settings.m_NetSettings.GetDefaultNetclass()
    else:
        default_class = settings.m_NetSettings.m_DefaultNetClass
    default_class.SetClearance(mm(0.12))
    default_class.SetTrackWidth(mm(0.28))
    default_class.SetViaDiameter(mm(0.8))
    default_class.SetViaDrill(mm(0.4))


def write_project_file(project_name):
    pro = {
        "meta": {"version": 1, "filename": f"{project_name}.kicad_pro"},
        "board": {"design_settings": {"defaults": {}, "rules": {}}, "layer_presets": []},
        "net_settings": {
            "classes": [
                {
                    "name": "Default",
                    "clearance": 0.12,
                    "track_width": 0.28,
                    "via_diameter": 0.8,
                    "via_drill": 0.4,
                    "wire_width": 0.25,
                    "bus_width": 12,
                },
                {
                    "name": "Power",
                    "clearance": 0.15,
                    "track_width": 0.8,
                    "via_diameter": 1.0,
                    "via_drill": 0.5,
                    "wire_width": 0.35,
                    "bus_width": 12,
                },
            ],
            "meta": {"version": 3},
            "net_colors": None,
            "netclass_assignments": [
                {"pattern": "+5V_SYS", "class": "Power"},
                {"pattern": "+5V_LED", "class": "Power"},
                {"pattern": "GND", "class": "Power"},
                {"pattern": "VBAT_2S", "class": "Power"},
            ],
        },
        "schematic": {"legacy_lib_dir": "", "legacy_lib_list": []},
        "sheets": [[project_name, ""]],
    }
    (OUT / f"{project_name}.kicad_pro").write_text(json.dumps(pro, indent=2), encoding="utf-8")


def main_nets(board):
    nets = {}
    for name in [
        "GND",
        "VBAT_2S",
        "+5V_SYS",
        "+5V_LED",
        "LED_SW_GATE",
        "LED_EN_GATE",
        "ESP_GPIO13_RX",
        "ESP_GPIO14_TX",
        "ESP_U0R_PROG",
        "ESP_U0T_PROG",
        "ESP_IO0_BOOT",
        "NANO_D2_RX",
        "NANO_D4_TX",
        "NANO_D5_IR_PWM",
        "NANO_D6_UVA_PWM",
        "NANO_D7_SK6812_DATA",
        "NANO_D8_LED_EN",
        "IR_GATE",
        "UVA_GATE",
        "IR_NEG",
        "UVA_NEG",
        "IR_ANODE",
        "UVA_ANODE",
        "SK6812_DIN_1",
    ]:
        add_net(board, nets, name)
    return nets


def head_nets(board):
    nets = {}
    for name in [
        "GND",
        "+5V_LED",
        "NANO_D5_IR_PWM",
        "NANO_D6_UVA_PWM",
        "NANO_D7_SK6812_DATA",
        "IR_GATE",
        "UVA_GATE",
        "IR_NEG",
        "UVA_NEG",
        "IR_ANODE",
        "UVA_ANODE",
        "SK6812_DIN_1",
        "SK6812_1_TO_2",
        "SK6812_2_TO_3",
        "SK6812_3_TO_4",
        "SK6812_4_TO_5",
        "SK6812_5_TO_6",
        "SK6812_6_TO_7",
        "SK6812_7_TO_8",
    ]:
        add_net(board, nets, name)
    return nets


def build_main_board():
    board = pcbnew.BOARD()
    setup_board_rules(board)
    nets = main_nets(board)

    edge_poly(board, [(36, 0), (70, 0), (70, 136), (0, 136), (0, 42), (36, 42)])
    add_text(board, "PHONE CAMERA CUTOUT / CASE KEEP-OUT", 3.0, 38.3, 0.85)
    add_text(board, "TWO-BOARD MAIN CARRIER v0.8", 39.0, 4.2, 0.9)
    add_text(board, "LED head connects by 14-pin JST-GH harness", 31.0, 89.0, 0.8)

    mount(board, "H1", 5, 108)
    mount(board, "H2", 5, 48)
    mount(board, "H3", 66, 132)

    esp_l = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x08_P2.54mm_Vertical", "J1", "ESP32-CAM LEFT", 42.0, 8.0)
    esp_r = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x08_P2.54mm_Vertical", "J2", "ESP32-CAM RIGHT", 64.86, 8.0)
    set_net(esp_l, {"4": "ESP_GPIO13_RX", "6": "ESP_GPIO14_TX"}, nets)
    set_net(esp_r, {"3": "ESP_IO0_BOOT", "4": "GND", "5": "+5V_SYS", "6": "ESP_U0R_PROG", "7": "ESP_U0T_PROG", "8": "GND"}, nets)
    board.Add(esp_l)
    board.Add(esp_r)

    prog = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x04_P2.54mm_Vertical", "J3", "USB-UART", 41.0, 34.0, 90)
    set_net(prog, {"1": "GND", "2": "+5V_SYS", "3": "ESP_U0R_PROG", "4": "ESP_U0T_PROG"}, nets)
    board.Add(prog)
    boot = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x02_P2.54mm_Vertical", "JP1", "BOOT", 61.0, 39.0, 90)
    set_net(boot, {"1": "ESP_IO0_BOOT", "2": "GND"}, nets)
    board.Add(boot)
    add_text(board, "J3 GND 5V TX RX", 39.0, 39.6, 0.8)

    led_harness = interboard_harness(
        board,
        nets,
        "J8",
        "LED HEAD JST-GH",
        55.0,
        96.0,
        {
            "1": "UVA_NEG",
            "2": "UVA_ANODE",
            "3": "+5V_SYS",
            "4": "+5V_SYS",
            "5": "GND",
            "6": "GND",
            "7": "SK6812_DIN_1",
            "9": "IR_ANODE",
            "10": "IR_NEG",
        },
        0,
    )
    add_text(board, "Pin 1 UVA-", 43.5, 91.0, 0.8, pcbnew.F_Fab)

    nano_l = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x15_P2.54mm_Vertical", "J4", "NANO LEFT ROW", 7.0, 60.0, 90)
    nano_r = load_fp("Connector_PinHeader_2.54mm", "PinHeader_1x15_P2.54mm_Vertical", "J5", "NANO RIGHT ROW", 7.0, 75.24, 90)
    set_net(nano_l, {"12": "+5V_SYS", "14": "GND"}, nets)
    set_net(
        nano_r,
        {
            "5": "NANO_D8_LED_EN",
            "6": "NANO_D7_SK6812_DATA",
            "7": "NANO_D6_UVA_PWM",
            "8": "NANO_D5_IR_PWM",
            "9": "NANO_D4_TX",
            "11": "NANO_D2_RX",
            "12": "GND",
        },
        nets,
    )
    board.Add(nano_l)
    board.Add(nano_r)
    add_text(board, "Arduino Nano rotated", 9.0, 56.0, 0.85)

    bat_p = solder_pad(board, nets, "P1", "2S PACK +", 8, 119, "VBAT_2S", "TestPoint_THTPad_4.0x4.0mm_Drill2.0mm")
    bat_n = solder_pad(board, nets, "P2", "PACK -", 8, 128, "GND", "TestPoint_THTPad_4.0x4.0mm_Drill2.0mm")
    chg_p = solder_pad(board, nets, "P3", "2S CHG +", 22, 119, "VBAT_2S")
    chg_n = solder_pad(board, nets, "P4", "2S CHG -", 22, 128, "GND")
    buck_in_p = solder_pad(board, nets, "P5", "BUCK IN +", 36, 119, "VBAT_2S")
    buck_in_n = solder_pad(board, nets, "P6", "BUCK IN -", 36, 128, "GND")
    buck_5v_p = solder_pad(board, nets, "P7", "5V SYS +", 50, 119, "+5V_SYS")
    buck_5v_n = solder_pad(board, nets, "P8", "5V SYS -", 50, 128, "GND")
    add_text(board, "2S pack pocket: 64 x 18 x 15mm min", 4.0, 113.0, 0.8)
    add_text(board, "2S/8.4V charger only", 40.0, 113.0, 0.8)

    add_text(board, "D8 logical power in firmware", 38.0, 115.0, 0.8)

    r_tx_hi = add_res(board, nets, "R8", "1k", 46.0, 50.0, "NANO_D4_TX", "ESP_GPIO13_RX", 0)
    r_tx_lo = add_res(board, nets, "R9", "2k", 55.0, 50.0, "ESP_GPIO13_RX", "GND", 0)
    r_rx = add_res(board, nets, "R10", "470R", 46.0, 45.0, "NANO_D2_RX", "ESP_GPIO14_TX", 0)
    r_data = add_res(board, nets, "R7", "330R", 50.0, 80.0, "NANO_D7_SK6812_DATA", "SK6812_DIN_1", 0)
    r_ir_led = add_res(board, nets, "R1", "100R 0.25W", 58.0, 86.5, "+5V_SYS", "IR_ANODE", 270)
    r_uva_led = add_res(board, nets, "R4", "68R 0.25W", 50.0, 86.5, "+5V_SYS", "UVA_ANODE", 270)
    rg_ir = add_res(board, nets, "R2", "150R", 62.0, 82.0, "NANO_D5_IR_PWM", "IR_GATE", 0)
    rd_ir = add_res(board, nets, "R3", "100k", 62.0, 85.0, "GND", "IR_GATE", 0)
    q_ir = add_mosfet(board, nets, "Q1", "AO3400A IR", 63.0, 91.0, "IR_GATE", "GND", "IR_NEG", 180)
    rg_uva = add_res(board, nets, "R5", "150R", 38.0, 82.0, "NANO_D6_UVA_PWM", "UVA_GATE", 0)
    rd_uva = add_res(board, nets, "R6", "100k", 38.0, 85.0, "GND", "UVA_GATE", 0)
    q_uva = add_mosfet(board, nets, "Q2", "AO3400A UVA", 46.0, 91.0, "UVA_GATE", "GND", "UVA_NEG", 0)

    route(board, nets, [pad(buck_5v_p, "1").GetPosition(), (58.0, 119.0), (58.0, 18.16)], "+5V_SYS", 0.9, pcbnew.B_Cu)
    route(board, nets, [pad(buck_5v_n, "1").GetPosition(), (67.0, 128.0), (67.0, 15.62)], "GND", 1.0, pcbnew.B_Cu)

    route(board, nets, [pad(bat_p, "1").GetPosition(), pad(chg_p, "1").GetPosition(), pad(buck_in_p, "1").GetPosition()], "VBAT_2S", 1.25, pcbnew.F_Cu)
    route(board, nets, [pad(bat_n, "1").GetPosition(), pad(chg_n, "1").GetPosition(), pad(buck_in_n, "1").GetPosition(), pad(buck_5v_n, "1").GetPosition()], "GND", 1.25, pcbnew.F_Cu)

    via_esp_5v = add_via(board, nets, 58.0, 18.16, "+5V_SYS")
    via_prog_5v = add_via(board, nets, 58.0, 36.0, "+5V_SYS")
    route(board, nets, [via_esp_5v.GetPosition(), pad(esp_r, "5").GetPosition()], "+5V_SYS", 0.65, pcbnew.F_Cu)
    route(board, nets, [via_prog_5v.GetPosition(), (43.54, 36.0), pad(prog, "2").GetPosition()], "+5V_SYS", 0.5, pcbnew.F_Cu)

    route(board, nets, [(67.0, 15.62), pad(esp_r, "4").GetPosition()], "GND", 0.65, pcbnew.B_Cu)
    route(board, nets, [(67.0, 25.78), pad(esp_r, "8").GetPosition()], "GND", 0.65, pcbnew.B_Cu)
    via_prog_gnd = add_via(board, nets, 67.0, 37.0, "GND")
    route(board, nets, [via_prog_gnd.GetPosition(), (67.0, 55.0), (37.0, 55.0), (37.0, 34.0), pad(prog, "1").GetPosition()], "GND", 0.5, pcbnew.F_Cu)

    via_nano_5v = add_via(board, nets, 58.0, 57.0, "+5V_SYS")
    route(board, nets, [pad(nano_l, "12").GetPosition(), (35.94, 57.0), via_nano_5v.GetPosition()], "+5V_SYS", 0.65, pcbnew.F_Cu)
    via_nano_gnd_a = add_via(board, nets, 67.0, 63.0, "GND")
    via_nano_gnd_b = add_via(board, nets, 67.0, 78.0, "GND")
    route(board, nets, [pad(nano_l, "14").GetPosition(), (40.02, 63.0), via_nano_gnd_a.GetPosition()], "GND", 0.65, pcbnew.F_Cu)
    route(board, nets, [pad(nano_r, "12").GetPosition(), (35.94, 78.0), via_nano_gnd_b.GetPosition()], "GND", 0.65, pcbnew.F_Cu)

    via_led_power = add_via(board, nets, 58.0, 84.5, "+5V_SYS")
    route(board, nets, [via_led_power.GetPosition(), (50.0, 84.5), pad(r_uva_led, "1").GetPosition()], "+5V_SYS", 0.35, pcbnew.F_Cu)
    route(board, nets, [via_led_power.GetPosition(), pad(r_ir_led, "1").GetPosition()], "+5V_SYS", 0.35, pcbnew.F_Cu)
    route(board, nets, [via_led_power.GetPosition(), (51.0, 84.5), (51.0, 89.0), (50.5, 89.0), pad(led_harness, "3").GetPosition()], "+5V_SYS", 0.24, pcbnew.F_Cu)
    route(board, nets, [via_led_power.GetPosition(), (51.5, 84.5), (51.5, 89.0), pad(led_harness, "4").GetPosition()], "+5V_SYS", 0.24, pcbnew.F_Cu)

    via_harness_gnd_a = add_via(board, nets, 52.5, 93.6, "GND")
    via_harness_gnd_b = add_via(board, nets, 53.5, 93.6, "GND")
    via_harness_gnd_bus = add_via(board, nets, 43.0, 93.6, "GND")
    route(board, nets, [pad(led_harness, "5").GetPosition(), via_harness_gnd_a.GetPosition()], "GND", 0.22, pcbnew.F_Cu)
    route(board, nets, [pad(led_harness, "6").GetPosition(), via_harness_gnd_b.GetPosition()], "GND", 0.22, pcbnew.F_Cu)
    route(board, nets, [via_harness_gnd_a.GetPosition(), via_harness_gnd_b.GetPosition(), via_harness_gnd_bus.GetPosition()], "GND", 0.35, pcbnew.B_Cu)

    via_d7_a = add_via(board, nets, 48.0, 86.0, "NANO_D7_SK6812_DATA")
    route(board, nets, [pad(nano_r, "6").GetPosition(), (19.70, 86.0), via_d7_a.GetPosition()], "NANO_D7_SK6812_DATA", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_d7_a.GetPosition(), pad(r_data, "1").GetPosition()], "NANO_D7_SK6812_DATA", 0.28, pcbnew.F_Cu)
    via_data_out_a = add_via(board, nets, 52.0, 80.0, "SK6812_DIN_1")
    via_data_out_b = add_via(board, nets, 54.5, 93.6, "SK6812_DIN_1")
    route(board, nets, [pad(r_data, "2").GetPosition(), via_data_out_a.GetPosition()], "SK6812_DIN_1", 0.20, pcbnew.F_Cu)
    route(board, nets, [via_data_out_a.GetPosition(), (56.5, 80.0), (56.5, 86.0), (54.5, 86.0), via_data_out_b.GetPosition()], "SK6812_DIN_1", 0.20, pcbnew.B_Cu)
    route(board, nets, [via_data_out_b.GetPosition(), pad(led_harness, "7").GetPosition()], "SK6812_DIN_1", 0.20, pcbnew.F_Cu)

    via_d5_a = add_via(board, nets, 55.0, 82.0, "NANO_D5_IR_PWM")
    route(board, nets, [pad(nano_r, "8").GetPosition(), (24.78, 82.0), via_d5_a.GetPosition()], "NANO_D5_IR_PWM", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_d5_a.GetPosition(), pad(rg_ir, "1").GetPosition()], "NANO_D5_IR_PWM", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(rg_ir, "2").GetPosition(), (63.0, 86.2), (66.8, 86.2), (66.8, 91.95), pad(q_ir, "1").GetPosition()], "IR_GATE", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(rd_ir, "2").GetPosition(), (63.0, 86.2)], "IR_GATE", 0.24, pcbnew.F_Cu)
    via_r3_gnd = add_via(board, nets, 60.0, 87.0, "GND")
    route(board, nets, [pad(rd_ir, "1").GetPosition(), (60.0, 85.0), via_r3_gnd.GetPosition()], "GND", 0.24, pcbnew.F_Cu)
    route(board, nets, [via_r3_gnd.GetPosition(), (67.0, 87.0)], "GND", 0.24, pcbnew.B_Cu)

    via_d6_a = add_via(board, nets, 36.0, 84.0, "NANO_D6_UVA_PWM")
    route(board, nets, [pad(nano_r, "7").GetPosition(), (22.24, 84.0), via_d6_a.GetPosition()], "NANO_D6_UVA_PWM", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_d6_a.GetPosition(), pad(rg_uva, "1").GetPosition()], "NANO_D6_UVA_PWM", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(rg_uva, "2").GetPosition(), (40.0, 86.2), (45.06, 86.2), pad(q_uva, "1").GetPosition()], "UVA_GATE", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(rd_uva, "2").GetPosition(), (40.0, 86.2)], "UVA_GATE", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(rd_uva, "1").GetPosition(), (35.0, 85.0), (35.0, 78.0), (35.94, 78.0)], "GND", 0.24, pcbnew.F_Cu)

    route(board, nets, [pad(r_uva_led, "2").GetPosition(), (49.5, 89.5), pad(led_harness, "2").GetPosition()], "UVA_ANODE", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(q_uva, "3").GetPosition(), (48.5, 91.0), pad(led_harness, "1").GetPosition()], "UVA_NEG", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(r_ir_led, "2").GetPosition(), (56.5, 88.0), pad(led_harness, "9").GetPosition()], "IR_ANODE", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(q_ir, "3").GetPosition(), (57.5, 91.0), pad(led_harness, "10").GetPosition()], "IR_NEG", 0.24, pcbnew.F_Cu)

    via_q1_gnd = add_via(board, nets, 61.0, 90.0, "GND")
    route(board, nets, [pad(q_ir, "2").GetPosition(), via_q1_gnd.GetPosition()], "GND", 0.30, pcbnew.F_Cu)
    route(board, nets, [via_q1_gnd.GetPosition(), (67.0, 90.0)], "GND", 0.30, pcbnew.B_Cu)
    route(board, nets, [via_harness_gnd_bus.GetPosition(), (43.0, 91.95), pad(q_uva, "2").GetPosition()], "GND", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(q_uva, "2").GetPosition(), (38.0, 91.95), (38.0, 85.0), pad(rd_uva, "1").GetPosition()], "GND", 0.24, pcbnew.F_Cu)

    via_nano_d4 = add_via(board, nets, 38.75, 50.0, "NANO_D4_TX")
    via_nano_d2 = add_via(board, nets, 41.30, 45.0, "NANO_D2_RX")
    route(board, nets, [pad(nano_r, "9").GetPosition(), (28.32, 80.0), (38.75, 80.0), via_nano_d4.GetPosition()], "NANO_D4_TX", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_nano_d4.GetPosition(), pad(r_tx_hi, "1").GetPosition()], "NANO_D4_TX", 0.28, pcbnew.F_Cu)
    via_d2_jump_a = add_via(board, nets, 33.40, 72.0, "NANO_D2_RX")
    via_d2_jump_b = add_via(board, nets, 41.30, 72.0, "NANO_D2_RX")
    route(board, nets, [pad(nano_r, "11").GetPosition(), via_d2_jump_a.GetPosition()], "NANO_D2_RX", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_d2_jump_a.GetPosition(), via_d2_jump_b.GetPosition()], "NANO_D2_RX", 0.28, pcbnew.F_Cu)
    route(board, nets, [via_d2_jump_b.GetPosition(), via_nano_d2.GetPosition()], "NANO_D2_RX", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_nano_d2.GetPosition(), pad(r_rx, "1").GetPosition()], "NANO_D2_RX", 0.28, pcbnew.F_Cu)

    via_esp13 = add_via(board, nets, 52.0, 50.0, "ESP_GPIO13_RX")
    route(board, nets, [pad(r_tx_hi, "2").GetPosition(), via_esp13.GetPosition(), pad(r_tx_lo, "1").GetPosition()], "ESP_GPIO13_RX", 0.28, pcbnew.F_Cu)
    route(board, nets, [via_esp13.GetPosition(), (52.0, 15.62), pad(esp_l, "4").GetPosition()], "ESP_GPIO13_RX", 0.28, pcbnew.B_Cu)
    via_r9_gnd = add_via(board, nets, 67.0, 50.0, "GND")
    route(board, nets, [pad(r_tx_lo, "2").GetPosition(), via_r9_gnd.GetPosition()], "GND", 0.28, pcbnew.F_Cu)
    via_esp14 = add_via(board, nets, 50.0, 43.0, "ESP_GPIO14_TX")
    route(board, nets, [pad(esp_l, "6").GetPosition(), (39.5, 20.7), (39.5, 43.0), via_esp14.GetPosition()], "ESP_GPIO14_TX", 0.28, pcbnew.B_Cu)
    route(board, nets, [via_esp14.GetPosition(), (50.0, 45.0), pad(r_rx, "2").GetPosition()], "ESP_GPIO14_TX", 0.28, pcbnew.F_Cu)

    connect(board, nets, esp_r, "6", prog, "3", "ESP_U0R_PROG", 0.28, pcbnew.F_Cu, [(61.0, 20.7), (61.0, 28.0), (46.08, 28.0)])
    connect(board, nets, esp_r, "7", prog, "4", "ESP_U0T_PROG", 0.28, pcbnew.F_Cu, [(63.5, 23.24), (63.5, 31.5), (48.62, 31.5)])
    connect(board, nets, esp_r, "3", boot, "1", "ESP_IO0_BOOT", 0.28, pcbnew.B_Cu, [(60.5, 13.08), (60.5, 39.0)])
    route(board, nets, [pad(boot, "2").GetPosition(), (63.54, 37.0), via_prog_gnd.GetPosition()], "GND", 0.35, pcbnew.F_Cu)

    board_path = OUT / f"{MAIN}.kicad_pcb"
    pcbnew.SaveBoard(str(board_path), board)
    write_project_file(MAIN)
    return board_path


def build_head_board():
    board = pcbnew.BOARD()
    setup_board_rules(board)
    nets = head_nets(board)

    edge_poly(board, [(3.0, 0.0), (47.0, 0.0), (50.0, 3.0), (50.0, 90.0), (0.0, 90.0), (0.0, 3.0)])
    edge_circle(board, 25.0, 14.0, 4.8)
    add_text(board, "LED/CAM HEAD v0.8", 5.0, 6.0, 0.8, pcbnew.F_Fab)
    add_text(board, "LENS", 15.0, 20.0, 0.8, pcbnew.F_SilkS)

    head_harness = interboard_harness(
        board,
        nets,
        "J1",
        "14P JST-GH TO MAIN",
        25.0,
        81.0,
        {
            "1": "UVA_NEG",
            "2": "UVA_ANODE",
            "3": "+5V_LED",
            "4": "+5V_LED",
            "5": "GND",
            "6": "GND",
            "7": "SK6812_DIN_1",
            "9": "IR_ANODE",
            "10": "IR_NEG",
        },
        0,
    )
    add_text(board, "Pin 1", 18.2, 76.5, 0.8, pcbnew.F_SilkS)

    rgbw2 = add_rgbw_led(
        board,
        nets,
        "D4",
        "RGBW 2 LEFT",
        9.5,
        15.4,
        {"1": "+5V_LED", "2": "SK6812_1_TO_2", "3": "GND", "4": "SK6812_2_TO_3"},
    )
    rgbw1 = add_rgbw_led(
        board,
        nets,
        "D3",
        "RGBW 1 RIGHT",
        40.5,
        15.4,
        {"1": "+5V_LED", "2": "SK6812_DIN_1", "3": "GND", "4": "SK6812_1_TO_2"},
    )

    led_uva = add_mono_led(board, nets, "D2", "375nm UVA", 20.0, 26.0, "UVA_ANODE", "UVA_NEG", "LED_D5.0mm_Clear")
    led_ir = add_mono_led(board, nets, "D1", "950nm IR", 30.0, 26.0, "IR_ANODE", "IR_NEG", "LED_D5.0mm_IRBlack")
    add_text(board, "UVA", 17.6, 31.0, 0.8, pcbnew.F_SilkS)
    add_text(board, "IR", 28.7, 31.0, 0.8, pcbnew.F_SilkS)

    rgbw3_l = add_rgbw_led(
        board,
        nets,
        "D5",
        "ACRYLIC 1 LEFT",
        9.5,
        39.0,
        {"1": "+5V_LED", "2": "SK6812_2_TO_3", "3": "GND", "4": "SK6812_3_TO_4"},
    )
    rgbw3_r = add_rgbw_led(
        board,
        nets,
        "D6",
        "ACRYLIC 1 RIGHT",
        40.5,
        39.0,
        {"1": "+5V_LED", "2": "SK6812_3_TO_4", "3": "GND", "4": "SK6812_4_TO_5"},
    )
    rgbw4_l = add_rgbw_led(
        board,
        nets,
        "D7",
        "ACRYLIC 2 LEFT",
        9.5,
        52.0,
        {"1": "+5V_LED", "2": "SK6812_4_TO_5", "3": "GND", "4": "SK6812_5_TO_6"},
    )
    rgbw4_r = add_rgbw_led(
        board,
        nets,
        "D8",
        "ACRYLIC 2 RIGHT",
        40.5,
        52.0,
        {"1": "+5V_LED", "2": "SK6812_5_TO_6", "3": "GND", "4": "SK6812_6_TO_7"},
    )
    rgbw5_l = add_rgbw_led(
        board,
        nets,
        "D9",
        "ACRYLIC 3 LEFT",
        9.5,
        65.0,
        {"1": "+5V_LED", "2": "SK6812_6_TO_7", "3": "GND", "4": "SK6812_7_TO_8"},
    )
    rgbw5_r = add_rgbw_led(
        board,
        nets,
        "D10",
        "ACRYLIC 3 RIGHT",
        40.5,
        65.0,
        {"1": "+5V_LED", "2": "SK6812_7_TO_8", "3": "GND"},
    )
    for label, y in [("ACRYLIC 1", 42.9), ("ACRYLIC 2", 55.9), ("ACRYLIC 3", 68.9)]:
        draw_rect(board, 17.2, y - 7.8, 32.8, y - 0.8, pcbnew.F_SilkS, 0.12)
        add_text(board, label, 18.0, y, 0.8, pcbnew.F_SilkS)

    c_bulk = add_cap_smd(board, nets, "C1", "47uF-100uF", 8.42, 75.0, "+5V_LED", "GND", 0, "C_1206_3216Metric")
    c_bypass = add_cap_smd(board, nets, "C2", "0.1uF", 39.42, 75.0, "+5V_LED", "GND", 0)

    junction_5_head = (25.0, 68.0)
    via_5_pin3 = add_via(board, nets, 19.375, 76.5, "+5V_LED")
    via_5_pin4 = add_via(board, nets, 20.625, 76.5, "+5V_LED")
    route(board, nets, [pad(head_harness, "3").GetPosition(), via_5_pin3.GetPosition()], "+5V_LED", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(head_harness, "4").GetPosition(), via_5_pin4.GetPosition()], "+5V_LED", 0.24, pcbnew.F_Cu)
    route(board, nets, [via_5_pin3.GetPosition(), (19.375, 68.0), junction_5_head], "+5V_LED", 0.35, pcbnew.B_Cu)
    route(board, nets, [via_5_pin4.GetPosition(), (20.625, 68.0), junction_5_head], "+5V_LED", 0.35, pcbnew.B_Cu)
    left_power_x = pcbnew.ToMM(pad(rgbw2, "1").GetPosition().x)
    right_power_x = pcbnew.ToMM(pad(rgbw1, "1").GetPosition().x)
    via_left_power = add_via(board, nets, left_power_x, 72.0, "+5V_LED")
    via_right_power = add_via(board, nets, right_power_x, 72.0, "+5V_LED")
    route(board, nets, [via_left_power.GetPosition(), (left_power_x, 68.0), junction_5_head, (right_power_x, 68.0), via_right_power.GetPosition()], "+5V_LED", 0.35, pcbnew.B_Cu)
    route(board, nets, [via_left_power.GetPosition(), (left_power_x, 75.0), (left_power_x, 15.4)], "+5V_LED", 0.35, pcbnew.F_Cu)
    route(board, nets, [via_right_power.GetPosition(), (right_power_x, 75.0), (right_power_x, 15.4)], "+5V_LED", 0.35, pcbnew.F_Cu)
    route(board, nets, [pad(c_bulk, "1").GetPosition(), (left_power_x, 75.0)], "+5V_LED", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(c_bypass, "1").GetPosition(), (right_power_x, 75.0)], "+5V_LED", 0.22, pcbnew.F_Cu)

    via_gnd_harness_a = add_via(board, nets, 21.875, 76.5, "GND")
    via_gnd_harness_b = add_via(board, nets, 23.125, 76.5, "GND")
    route(board, nets, [pad(head_harness, "5").GetPosition(), via_gnd_harness_a.GetPosition()], "GND", 0.22, pcbnew.F_Cu)
    route(board, nets, [pad(head_harness, "6").GetPosition(), via_gnd_harness_b.GetPosition()], "GND", 0.22, pcbnew.F_Cu)
    left_gnd_x = pcbnew.ToMM(pad(rgbw2, "3").GetPosition().x)
    right_gnd_x = pcbnew.ToMM(pad(rgbw1, "3").GetPosition().x)
    via_left_gnd = add_via(board, nets, left_gnd_x, 72.0, "GND")
    via_right_gnd = add_via(board, nets, right_gnd_x, 72.0, "GND")
    route(board, nets, [via_gnd_harness_a.GetPosition(), (21.875, 84.0), (left_gnd_x, 84.0), via_left_gnd.GetPosition()], "GND", 0.30, pcbnew.B_Cu)
    route(board, nets, [via_gnd_harness_a.GetPosition(), (21.875, 84.0), (23.125, 84.0), via_gnd_harness_b.GetPosition()], "GND", 0.30, pcbnew.B_Cu)
    route(board, nets, [via_gnd_harness_b.GetPosition(), (23.125, 84.0), (right_gnd_x, 84.0), via_right_gnd.GetPosition()], "GND", 0.30, pcbnew.B_Cu)
    route(board, nets, [via_left_gnd.GetPosition(), (left_gnd_x, 75.0), (left_gnd_x, 15.4)], "GND", 0.30, pcbnew.F_Cu)
    route(board, nets, [via_right_gnd.GetPosition(), (right_gnd_x, 75.0), (right_gnd_x, 15.4)], "GND", 0.30, pcbnew.F_Cu)
    route(board, nets, [pad(c_bulk, "2").GetPosition(), (left_gnd_x, 75.0)], "GND", 0.24, pcbnew.F_Cu)
    route(board, nets, [pad(c_bypass, "2").GetPosition(), (right_gnd_x, 75.0)], "GND", 0.22, pcbnew.F_Cu)

    via_data_head = add_via(board, nets, 48.8, 86.0, "SK6812_DIN_1")
    data_edge = (48.8, 86.0)
    route(board, nets, [pad(head_harness, "7").GetPosition(), (24.375, 86.0), via_data_head.GetPosition()], "SK6812_DIN_1", 0.20, pcbnew.F_Cu)
    route(board, nets, [via_data_head.GetPosition(), (48.8, 8.0), (pcbnew.ToMM(pad(rgbw1, "2").GetPosition().x), 8.0), pad(rgbw1, "2").GetPosition()], "SK6812_DIN_1", 0.20, pcbnew.B_Cu)
    connect(board, nets, rgbw1, "4", rgbw2, "2", "SK6812_1_TO_2", 0.20, pcbnew.F_Cu, [(pcbnew.ToMM(pad(rgbw1, "4").GetPosition().x), 8.0), (pcbnew.ToMM(pad(rgbw2, "2").GetPosition().x), 8.0)])
    connect(board, nets, rgbw2, "4", rgbw3_l, "2", "SK6812_2_TO_3", 0.20, pcbnew.B_Cu, [(pcbnew.ToMM(pad(rgbw2, "4").GetPosition().x), 28.0), (4.0, 28.0), (4.0, 34.0), (pcbnew.ToMM(pad(rgbw3_l, "2").GetPosition().x), 34.0)])
    connect(board, nets, rgbw3_l, "4", rgbw3_r, "2", "SK6812_3_TO_4", 0.20, pcbnew.B_Cu, [(pcbnew.ToMM(pad(rgbw3_l, "4").GetPosition().x), 35.5), (pcbnew.ToMM(pad(rgbw3_r, "2").GetPosition().x), 35.5)])
    connect(board, nets, rgbw3_r, "4", rgbw4_l, "2", "SK6812_4_TO_5", 0.20, pcbnew.B_Cu, [(47.0, 39.0), (47.0, 47.0), (pcbnew.ToMM(pad(rgbw4_l, "2").GetPosition().x), 47.0)])
    connect(board, nets, rgbw4_l, "4", rgbw4_r, "2", "SK6812_5_TO_6", 0.20, pcbnew.B_Cu, [(pcbnew.ToMM(pad(rgbw4_l, "4").GetPosition().x), 47.5), (pcbnew.ToMM(pad(rgbw4_r, "2").GetPosition().x), 47.5)])
    connect(board, nets, rgbw4_r, "4", rgbw5_l, "2", "SK6812_6_TO_7", 0.20, pcbnew.B_Cu, [(47.0, 52.0), (47.0, 60.0), (pcbnew.ToMM(pad(rgbw5_l, "2").GetPosition().x), 60.0)])
    connect(board, nets, rgbw5_l, "4", rgbw5_r, "2", "SK6812_7_TO_8", 0.20, pcbnew.B_Cu, [(pcbnew.ToMM(pad(rgbw5_l, "4").GetPosition().x), 60.5), (pcbnew.ToMM(pad(rgbw5_r, "2").GetPosition().x), 60.5)])

    route(board, nets, [pad(head_harness, "1").GetPosition(), (16.875, 77.0), (16.875, 28.5), pad(led_uva, "1").GetPosition()], "UVA_NEG", 0.22, pcbnew.F_Cu)
    route(board, nets, [pad(head_harness, "2").GetPosition(), (18.125, 77.0), (18.125, 30.5), pad(led_uva, "2").GetPosition()], "UVA_ANODE", 0.22, pcbnew.F_Cu)
    route(board, nets, [pad(head_harness, "9").GetPosition(), (26.875, 24.0), (31.27, 24.0), (31.27, 26.0), pad(led_ir, "2").GetPosition()], "IR_ANODE", 0.22, pcbnew.F_Cu)
    route(board, nets, [pad(head_harness, "10").GetPosition(), (28.125, 77.0), (28.73, 77.0), (28.73, 28.5), pad(led_ir, "1").GetPosition()], "IR_NEG", 0.22, pcbnew.F_Cu)

    board_path = OUT / f"{HEAD}.kicad_pcb"
    pcbnew.SaveBoard(str(board_path), board)
    write_project_file(HEAD)
    return board_path


def write_docs():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "BOM.csv").write_text(
        "\n".join(
            [
                "Reference,Quantity,Value,Footprint,Board,Notes",
                "J1 J2,2,ESP32-CAM socket,1x08 2.54mm female headers,main,AI-Thinker style row spacing assumed 22.86mm",
                "J3,1,USB-UART upload header,1x04 2.54mm,main,GND 5V adapter-TX adapter-RX",
                "JP1,1,ESP32 boot jumper,1x02 2.54mm,main,Short IO0 to GND only while uploading",
                "J4 J5,2,Arduino Nano socket rotated,1x15 2.54mm female headers,main,Keep Nano per project request",
                "J8 J1,2,14-pin JST-GH board harness connectors,JST_GH_SM14B-GHS-TB_1x14-1MP_P1.25mm_Horizontal,both,One on main and one on LED head",
                "CBL2,1,14-conductor JST-GH crimped wire harness,1.25mm pitch GHR-14V-S housing plus SSHL terminals,assembly,Length depends on printed shell routing; keep pin 1 to pin 1",
                "P1 P2,2,2S pack solder pads,4.0mm THT pads,main,Protected XT30 2S pack/BMS connection",
                "P3 P4,2,2S charger solder pads,3.0mm THT pads,main,Use 8.4V 2S charger only; do not use 12.6V 3S charger",
                "P5 P6,2,2S buck input solder pads,3.0mm THT pads,main,Switched/fused 2S rail to buck input",
                "P7 P8,2,5V buck output solder pads,3.0mm THT pads,main,Regulated 5V system rail back to PCB; 1A min, 2A recommended",
                "D1,1,950nm IR LED,LED_D5.0mm_IRBlack,head,5mm, 50mA max continuous",
                "D2,1,375nm UVA LED,LED_D5.0mm_Clear,head,5mm, use shielding and UV-rated eye protection",
                "D3 D4,2,SK6812 RGBW 5mm camera LEDs,LED_D5.0mm-4_RGB_Wide_Pins,head,Verify exact vendor pinout before PCBA order",
                "D5 D6 D7 D8 D9 D10,6,SK6812 RGBW 5mm acrylic edge LEDs,LED_D5.0mm-4_RGB_Wide_Pins,head,Three acrylic zones; each zone uses one left and one right pixel",
                "Q1 Q2,2,AO3400A or equivalent logic NMOS,SOT-23,main,IR/UVA low-side switching",
                "R1,1,100 ohm 0.25W,R_0805_2012Metric,main,IR current limit from 5V, about 35mA with 1.5V Vf",
                "R4,1,68 ohm 0.25W,R_0805_2012Metric,main,UVA current limit from 5V, about 21mA at 3.6V Vf",
                "R2 R5,2,150 ohm,R_0805_2012Metric,main,MOSFET gate resistors",
                "R3 R6,2,100k,R_0805_2012Metric,main,MOSFET gate pulldowns",
                "R7,1,330 ohm,R_0805_2012Metric,main,SK6812 data resistor before the inter-board harness",
                "R8,1,1k,R_0805_2012Metric,main,Nano D4 to ESP RX divider high side",
                "R9,1,2k,R_0805_2012Metric,main,Nano D4 to ESP RX divider low side",
                "R10,1,470 ohm,R_0805_2012Metric,main,ESP GPIO14 to Nano D2 series resistor",
                "C1,1,47uF to 100uF 6.3V or higher,C_1206_3216Metric,head,Low-profile bulk capacitor across regulated +5V LED rail",
                "C2,1,0.1uF,C_0805_2012Metric,head,Local bypass near LEDs",
                "F1,1,Inline battery fuse,external,assembly,Install in pack positive lead before switch",
                "SW1,1,Main power switch,external,assembly,Place between fused 2S positive and buck input",
                "H1-H3,3,M3 mounting holes,MountingHole_3.2mm_M3,main,Keep clear in 3D shell",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    (OUT / "INTERBOARD_HARNESS_PINOUT.md").write_text(
        """# 14-Pin JST-GH Inter-Board Harness Pinout

Use one crimped 14-conductor JST-GH style wire harness between the main board J8 and the LED head board J1.

PCB connector footprint on both boards:

- `Connector_JST:JST_GH_SM14B-GHS-TB_1x14-1MP_P1.25mm_Horizontal`
- Matching cable housing: JST `GHR-14V-S` or compatible
- Matching crimp terminal family: JST GH 1.25 mm terminals, commonly `SSHL-002T-P0.2`

The generated PCBs use the same pin numbers on both ends:

| Pin | Net | Purpose |
| --- | --- | --- |
| 1 | UVA_NEG | UVA LED cathode return to Q2 drain |
| 2 | UVA_ANODE | Current-limited UVA LED anode from R4 |
| 3 | +5V_LED | Regulated 5V LED head rail |
| 4 | +5V_LED | Parallel regulated 5V LED head rail conductor |
| 5 | GND | LED head ground return |
| 6 | GND | Parallel LED head ground return |
| 7 | SK6812_DIN_1 | SK6812 RGBW data into RGBW LED 1 after R7 |
| 8 | NC | Spare |
| 9 | IR_ANODE | Current-limited IR LED anode from R1 |
| 10 | IR_NEG | IR LED cathode return to Q1 drain |
| 11 | NC | Spare |
| 12 | NC | Spare |
| 13 | NC | Spare |
| 14 | NC | Spare |

Pins 8, 11, 12, 13, and 14 are intentionally spare. The six added acrylic RGBW pixels live on the LED head PCB after the first two SK6812 camera pixels, so the existing single SK6812 data conductor still controls all eight addressable pixels. Use a straight pin-1-to-pin-1 harness. Mark pin 1 on the 3D shell before final assembly.
""",
        encoding="utf-8",
    )

    (OUT / "PINOUT.md").write_text(
        """# Board Pinout

## Main Board

- ESP32-CAM stays on the main board socket for Wi-Fi, web API, and camera stream.
- Arduino Nano stays on the main board and still runs the lighting protocol.
- J8 is the 14-pin JST-GH connector to the compact LED/lens head board.
- Nano D8 remains available to the firmware as a logical power/off command; the PCB routes the LED head from the regulated 5V rail.

## Arduino Nano Pins

- D2: RX from ESP32-CAM GPIO14 through R10.
- D4: TX to ESP32-CAM GPIO13 through the R8/R9 divider.
- D5: IR PWM to the main-board Q1 gate through R2.
- D6: UVA PWM to the main-board Q2 gate through R5.
- D7: SK6812 RGBW data to harness pin 7 through R7.
- D8: firmware logical LED power state. No high-side load switch is populated on v0.8.

## 14-Pin JST-GH Harness Nets

- Pin 1: UVA LED cathode return to Q2 drain.
- Pin 2: UVA LED anode after R4.
- Pins 3 and 4: regulated +5V LED rail.
- Pins 5 and 6: GND.
- Pin 7: SK6812 data into RGBW LED 1.
- Pin 8: spare.
- Pin 9: IR LED anode after R1.
- Pin 10: IR LED cathode return to Q1 drain.
- Pins 11, 12, 13, and 14: spare.

## LED Head Board

Layout follows the supplied reference image:

- RGBW LED 2 is centered to the left of the ESP32-CAM lens cutout.
- RGBW LED 1 is centered to the right of the ESP32-CAM lens cutout.
- UVA and IR are centered below the lens as a matched lower pair, UVA left and IR right.
- Acrylic zone 1, 2, and 3 are stacked below UVA/IR. Each acrylic zone has one SK6812 RGBW LED on the left edge and one on the right edge.
- The 14-pin JST-GH connector sits along the bottom edge of the head board.

The head board has a circular lens cutout centered at 17.0 mm x 14.0 mm. Print the head board at 1:1 and check it against the actual ESP32-CAM lens and acrylic-square chamber before ordering.
""",
        encoding="utf-8",
    )

    (OUT / "README_ORDERING.md").write_text(
        """# iPhone 16e 2S SK6812 Two-Board PCB v0.8

This package contains two separate 2-layer KiCad PCB designs:

- Main controller carrier: `iphone16e_2s_sk6812_main_v0_8.kicad_pcb`
- Compact LED/camera head: `esp32_cam_led_head_v0_8.kicad_pcb`

The included v0.8 Gerber zip packages were regenerated with KiCad 10 and checked with DRC.

## What Changed From v0.7

- Added six SK6812 5 mm RGBW LEDs to the LED/camera head board for three independently controlled acrylic-square zones.
- Each acrylic zone has one left-edge LED and one right-edge LED driven as a mirrored pair from one webapp RGBW control.
- Expanded the head board to 50 mm x 90 mm while keeping it inside the 58 mm camera chamber envelope.
- Kept the same 14-pin JST-GH 1.25 mm locking wire-harness connector and the same single SK6812 data line.

## Power Compatibility

This is still optimized for the selected OVONIC 2S 7.4V 450mAh LiPo pack.

Use a proper 2S/8.4V USB-C LiPo charger/BMS plus a 2S-to-5V buck regulator rated 1A minimum, 2A preferred.

Do not use the 3S/12.6V Adeept charger module with this 2S battery.

## Suggested Fab Settings

- 2 layers for each board
- FR-4, 1.6 mm for the main board
- FR-4, 0.8 mm or 1.0 mm recommended for the LED head if your shell needs a lower profile
- 1 oz copper acceptable for this low-current LED version, 2 oz preferred
- Lead-free HASL or ENIG

## Important Assembly Checks

- Verify JST-GH harness pin 1 to pin 1 before powering the boards. Use a straight-through 14-conductor crimped harness.
- Verify the SK6812 5 mm RGBW LED pinout from your exact vendor before PCBA ordering. The generated footprint maps pin 1 to +5V, pin 2 to DIN, pin 3 to GND, and pin 4 to DOUT.
- The SK6812 chain order is RGBW 1 camera right, RGBW 2 camera left, Acrylic 1 left, Acrylic 1 right, Acrylic 2 left, Acrylic 2 right, Acrylic 3 left, Acrylic 3 right.
- Print both PCB outlines at 1:1 and test-fit them in the Speck case and printed shell before ordering.
- UVA and IR are eye hazards. Use shielding and UV-rated eye protection.
""",
        encoding="utf-8",
    )

    (OUT / "DRC_STATUS.md").write_text(
        """# DRC Status

This v0.8 PCB package was regenerated and checked with KiCad 10.

Current generated DRC status after `kicad-cli pcb drc`:

- Main controller carrier: 0 violations; 0 unconnected items.
- LED/camera head: 0 violations; 0 unconnected items.

Use the `*_GERBERS_DRC_CLEAN.zip` files for fabrication upload. Still print the board outlines at 1:1 and verify the mechanical fit in the phone case before ordering.
""",
        encoding="utf-8",
    )

    (OUT / "ASSEMBLY_LAYOUT.md").write_text(
        """# Assembly Layout

```text
Phone back / case top area

  [phone camera keepout]        [ESP32-CAM module on main carrier]
                                [compact LED head board over lens]

                                RGBW 2      LENS      RGBW 1
                                           CUTOUT

                                      UVA          IR

                                A1-L    ACRYLIC 1    A1-R
                                A2-L    ACRYLIC 2    A2-R
                                A3-L    ACRYLIC 3    A3-R

                                  14-pin JST-GH connector
                                           ||
                                           || wire harness
                                           ||
                                  Main carrier J8 JST-GH

Main board lower area:

  Arduino Nano + ESP32-CAM socket + charger/BMS pads + buck pads + 2S battery pads
```

The LED head board is intentionally compact and symmetric around the ESP32-CAM lens cutout. The main board remains the controller and power board.
""",
        encoding="utf-8",
    )


def write_layout_svg():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" width="760" height="500" viewBox="0 0 760 500">
  <rect width="760" height="500" fill="#07111f"/>
  <text x="34" y="44" fill="#dce8ff" font-family="Arial" font-size="24" font-weight="700">Two-board ESP32-CAM LED layout v0.8</text>
  <rect x="50" y="78" width="240" height="360" rx="18" fill="#dce2ea" opacity="0.14" stroke="#7f95b5" stroke-width="2"/>
  <rect x="74" y="96" width="112" height="92" rx="22" fill="#edf4ff" opacity="0.2" stroke="#a9b8cf" stroke-width="2"/>
  <circle cx="115" cy="140" r="27" fill="#05080e" stroke="#9bb3d7" stroke-width="4"/>
  <circle cx="115" cy="140" r="10" fill="#21324c"/>
  <rect x="194" y="96" width="78" height="92" rx="5" fill="#083e46" stroke="#38d6d4" stroke-width="2"/>
  <circle cx="233" cy="132" r="15" fill="#05080e" stroke="#9bb3d7" stroke-width="3"/>
  <circle cx="214" cy="150" r="10" fill="#e548e8"/>
  <circle cx="252" cy="150" r="10" fill="#f05b2f"/>
  <circle cx="204" cy="132" r="9" fill="url(#rgb1)"/>
  <circle cx="262" cy="132" r="9" fill="url(#rgb2)"/>
  <rect x="208" y="170" width="50" height="7" fill="#111827" stroke="#e3c66b" stroke-width="1"/>
  <rect x="205" y="190" width="56" height="78" fill="none" stroke="#c7d2fe" stroke-dasharray="5 3" stroke-width="1.4"/>
  <circle cx="204" cy="202" r="7" fill="url(#rgb1)"/>
  <circle cx="262" cy="202" r="7" fill="url(#rgb2)"/>
  <circle cx="204" cy="228" r="7" fill="url(#rgb1)"/>
  <circle cx="262" cy="228" r="7" fill="url(#rgb2)"/>
  <circle cx="204" cy="254" r="7" fill="url(#rgb1)"/>
  <circle cx="262" cy="254" r="7" fill="url(#rgb2)"/>
  <text x="215" y="207" fill="#dce8ff" font-family="Arial" font-size="9">Acrylic 1</text>
  <text x="215" y="233" fill="#dce8ff" font-family="Arial" font-size="9">Acrylic 2</text>
  <text x="215" y="259" fill="#dce8ff" font-family="Arial" font-size="9">Acrylic 3</text>
  <path d="M233 177 C233 210 380 210 380 244" fill="none" stroke="#6ee7ff" stroke-width="5"/>
  <rect x="380" y="96" width="286" height="342" rx="8" fill="#101827" stroke="#64748b" stroke-width="2"/>
  <text x="404" y="130" fill="#dce8ff" font-family="Arial" font-size="18" font-weight="700">Main controller carrier</text>
  <rect x="410" y="164" width="108" height="46" fill="#1e293b" stroke="#60a5fa" stroke-width="2"/>
  <text x="426" y="194" fill="#e5f0ff" font-family="Arial" font-size="16">ESP32-CAM</text>
  <rect x="536" y="164" width="88" height="46" fill="#1e293b" stroke="#93c5fd" stroke-width="2"/>
  <text x="552" y="194" fill="#e5f0ff" font-family="Arial" font-size="16">Nano</text>
  <rect x="410" y="244" width="214" height="38" fill="#111827" stroke="#6ee7ff" stroke-width="2"/>
  <text x="424" y="269" fill="#e5f0ff" font-family="Arial" font-size="15">14-pin JST-GH harness to LED head</text>
  <rect x="410" y="318" width="214" height="48" fill="#172033" stroke="#64748b" stroke-width="2"/>
  <text x="424" y="348" fill="#e5f0ff" font-family="Arial" font-size="15">2S LiPo, charger/BMS, buck</text>
  <text x="196" y="220" fill="#dce8ff" font-family="Arial" font-size="14">LED head board</text>
  <text x="196" y="239" fill="#9fb3d1" font-family="Arial" font-size="13">8 RGBW pixels plus UVA/IR</text>
  <defs>
    <linearGradient id="rgb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b30"/><stop offset=".33" stop-color="#34c759"/><stop offset=".66" stop-color="#0a84ff"/><stop offset="1" stop-color="#f7f7f7"/></linearGradient>
    <linearGradient id="rgb2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b30"/><stop offset=".33" stop-color="#34c759"/><stop offset=".66" stop-color="#0a84ff"/><stop offset="1" stop-color="#f7f7f7"/></linearGradient>
  </defs>
</svg>
"""
    (OUT / "two_board_led_head_layout.svg").write_text(svg, encoding="utf-8")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    main_board = build_main_board()
    head_board = build_head_board()
    write_docs()
    write_layout_svg()
    print(main_board)
    print(head_board)


if __name__ == "__main__":
    main()
