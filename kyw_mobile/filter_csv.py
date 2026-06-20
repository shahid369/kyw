import sys

file_path = "c:\\Users\\madbr\\Downloads\\org=mansukh investment and trading_type=sent_range=2026-06-15_2026-06-16_clrstream_report_1781600437103.csv"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    for i, line in enumerate(lines):
        if i == 0 or not line.startswith("2026-06-15"):
            new_lines.append(line)

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    print(f"Kept {len(new_lines)} lines, removed {len(lines) - len(new_lines)} lines.")
except Exception as e:
    print(f"Error: {e}")
