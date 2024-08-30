#!/bin/bash

# Získání názvu zálohy ze vstupního parametru
backup_name=$1

# Kontrola, zda byl zadán název zálohy
if [ -z "$backup_name" ]; then
    echo "Chyba: Název zálohy nebyl zadán."
    echo "Použití: ./restore.sh backup_název.txt"
    exit 1
fi

# Kontrola, zda záloha existuje
backup_file="$backup_name"
if [ ! -f "$backup_file" ]; then
    echo "Chyba: Záloha $backup_file neexistuje."
    exit 1
fi

# Funkce pro obnovení souborů z obsahu zálohy
function restore_files() {
    local start_line=$1
    local end_line=$2
    local file_path=$3

    # Odstranění prvního řádku (popis souboru), prázdných řádků a dalších popisů
    sed -n "${start_line},${end_line}p" "$backup_file" | sed '1d;/^----- File: /d;/^===== Directory: /d;/^$/d' > "$file_path"
    echo "Obnovený soubor: $file_path"
}

# Načtení souboru a obnovení jednotlivých částí
while IFS= read -r line; do
    if [[ $line == "===== Directory: "* ]]; then
        directory=$(echo "$line" | sed 's/===== Directory: \(.*\) =====/\1/')
    elif [[ $line == "----- File: "* ]]; then
        file_path=$(echo "$line" | sed 's/----- File: \(.*\) -----/\1/')
        start_line=$(grep -n "^----- File: $file_path -----" "$backup_file" | cut -d: -f1)
        end_line=$(grep -n "^----- File: " "$backup_file" | grep -A1 "^$start_line:" | tail -n1 | cut -d: -f1)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < "$backup_file")
        fi
        end_line=$((end_line - 1))
        restore_files "$start_line" "$end_line" "$file_path"
    elif [[ $line == "===== App.js =====" ]]; then
        start_line=$(grep -n "^===== App.js =====" "$backup_file" | cut -d: -f1)
        end_line=$(grep -n "^===== " "$backup_file" | grep -A1 "^$start_line:" | tail -n1 | cut -d: -f1)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < "$backup_file")
        fi
        end_line=$((end_line - 1))
        restore_files "$start_line" "$end_line" "App.js"
    elif [[ $line == "===== app.json =====" ]]; then
        start_line=$(grep -n "^===== app.json =====" "$backup_file" | cut -d: -f1)
        end_line=$(grep -n "^===== " "$backup_file" | grep -A1 "^$start_line:" | tail -n1 | cut -d: -f1)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < "$backup_file")
        fi
        end_line=$((end_line - 1))
        restore_files "$start_line" "$end_line" "app.json"
    fi
done < "$backup_file"

echo "Obnova ze zálohy $backup_name dokončena."

