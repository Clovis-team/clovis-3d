#!/bin/bash

# checks if the number of arguments is different to 2 and 3
if [ $# != 1 ] && [ $# != 2 ] && [ $# != 3 ]; then
        echo " usage: $0 folder_to_convert [output_format] [-converter]\nstandard converter assimp, output .obj"
else
    # for files in folder(argument1)
    for i in $1/*.ifc; do
        [ -f "$i" ] || break
            sh convert.sh $i $2 $3
    done
fi