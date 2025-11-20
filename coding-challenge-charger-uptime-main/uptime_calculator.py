#!/usr/bin/env python3
"""
Electric Era Coding Challenge - Station Uptime Calculator
"""

import sys

def calculate_uptime(station_reports, min_time, max_time):
    """Calculate uptime for a station given its charger reports."""
    events = []
    for start, end, up in station_reports:
        if up:
            events.append((start, 1))
            events.append((end, -1))
    
    events.sort()
    
    uptime = 0
    active_chargers = 0
    last_time = min_time
    
    for time, delta in events:
        if active_chargers > 0:
            uptime += time - last_time
        active_chargers += delta
        last_time = time
    
    total_time = max_time - min_time
    if total_time == 0:
        return 0
    
    percentage = int(uptime * 100 / total_time)
    return percentage


def main():
    if len(sys.argv) != 2:
        print("ERROR", file=sys.stderr)
        print("ERROR")
        sys.exit(1)
    
    try:
        with open(sys.argv[1], 'r') as f:
            lines = [line.strip() for line in f if line.strip()]
        
        stations = {}
        reports = []
        
        section = None
        for line in lines:
            if line == "[Stations]":
                section = "stations"
                continue
            elif line == "[Charger Availability Reports]":
                section = "reports"
                continue
            
            if section == "stations":
                parts = line.split()
                if len(parts) < 1:
                    raise ValueError("Invalid station line")
                
                station_id = int(parts[0])
                charger_ids = [int(x) for x in parts[1:]]
                stations[station_id] = charger_ids
                
            elif section == "reports":
                parts = line.split()
                if len(parts) != 4:
                    raise ValueError("Invalid report line")
                
                charger_id = int(parts[0])
                start = int(parts[1])
                end = int(parts[2])
                up = parts[3].lower() == "true"
                
                if start > end:
                    raise ValueError("Invalid time range")
                
                reports.append((charger_id, start, end, up))
        
        results = []
        for station_id in sorted(stations.keys()):
            charger_ids = stations[station_id]
            
            station_reports = [
                (start, end, up) 
                for cid, start, end, up in reports 
                if cid in charger_ids
            ]
            
            if not station_reports:
                results.append((station_id, 0))
                continue
            
            min_time = min(start for start, end, up in station_reports)
            max_time = max(end for start, end, up in station_reports)
            
            uptime_pct = calculate_uptime(station_reports, min_time, max_time)
            results.append((station_id, uptime_pct))
        
        for station_id, uptime in results:
            if station_id == results[-1][0]:
                print(f"{station_id} {uptime}", end='')
            else:
                print(f"{station_id} {uptime}")
    
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        print("ERROR")
        sys.exit(1)


if __name__ == "__main__":
    main()
