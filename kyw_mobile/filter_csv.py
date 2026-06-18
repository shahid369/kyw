import sys

file_path = "c:\\Users\\madbr\\Downloads\\org=mansukh investment and trading_type=deferred_range=2026-06-16_2026-06-17_clrstream_report_1781686842309.csv"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    for i, line in enumerate(lines):
        if i == 0 or not line.startswith("2026-06-17"):
            new_lines.append(line)

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    print(f"Kept {len(new_lines)} lines, removed {len(lines) - len(new_lines)} lines.")
except Exception as e:
    print(f"Error: {e}")
