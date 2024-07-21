#!/bin/bash

npm run build

file="./dist/script.user.js"

header=$(cat << 'EOF'
// ==UserScript==
// @name         GitHub Personal Events
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  This plugin is used to display personal events on the GitHub homepage
// @author       ahaostudy
// @license      MIT
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addStyle
// ==/UserScript==
EOF
)

temp_file=$(mktemp)
echo "$header" > "$temp_file"

if [ -f "$file" ]; then
  cat "$file" >> "$temp_file"
fi

mv "$temp_file" "$file"