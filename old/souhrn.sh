#!/bin/bash

# Výstupní soubory pro uložení obsahu projektu
output_file1="project_contents_part1.txt"
output_file2="project_contents_part2.txt"




# Zálohování starých souborů s časovým razítkem
timestamp=$(date +"%Y%m%d_%H%M%S")
if [ -f "$output_file1" ] || [ -f "$output_file2" ]; then
    mkdir -p backup
    if [ -f "$output_file1" ]; then
        mv "$output_file1" "backup/backup_part1_$timestamp.txt"
        echo "Původní soubor $output_file1 byl zálohován jako backup_part1_$timestamp.txt"
    fi
    if [ -f "$output_file2" ]; then
        mv "$output_file2" "backup/backup_part2_$timestamp.txt"
        echo "Původní soubor $output_file2 byl zálohován jako backup_part2_$timestamp.txt"
    fi
fi

# Funkce pro vypsání obsahu souborů v daném adresáři
function cat_files_in_directory() {
    local directory=$1
    local output_file=$2
    echo "===== Directory: $directory =====" >> "$output_file"
    for file in "$directory"/*.{js,json}; do
        if [ -f "$file" ] && [[ "$file" != *"package-lock.json" ]]; then
            echo "----- File: $file -----" >> "$output_file"
            cat "$file" >> "$output_file"
            echo -e "\n" >> "$output_file"
        fi
    done
}

# Výpis souborů z kořenového adresáře do prvního souboru
echo "===== Root Directory =====" >> "$output_file1"
for file in ./*.{js,json}; do
    if [ -f "$file" ] && [[ "$file" != "./package-lock.json" ]]; then
        echo "----- File: $file -----" >> "$output_file1"
        cat "$file" >> "$output_file1"
        echo -e "\n" >> "$output_file1"
    fi
done

# Výpis souborů z jednotlivých adresářů do prvního souboru
cat_files_in_directory "components" "$output_file1"
cat_files_in_directory "models" "$output_file1"

# Výpis souborů z jednotlivých adresářů do druhého souboru
cat_files_in_directory "screens" "$output_file2"
cat_files_in_directory "data" "$output_file2"
cat_files_in_directory "utils" "$output_file2"



echo "Všechny soubory byly zpracovány a zálohovány."
