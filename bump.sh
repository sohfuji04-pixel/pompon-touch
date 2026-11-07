#!/bin/sh
# 更新のたびに実行: index.html と version.json のバージョンをそろえる（開いている人のページが自動で再読み込みされる）
V=$(date +%Y%m%d%H%M%S)
sed -i "s/const APP_VERSION='[^']*'/const APP_VERSION='$V'/" index.html
printf '{"v":"%s"}\n' "$V" > version.json
echo "$V"
