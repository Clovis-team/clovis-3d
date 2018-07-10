#!/bin/bash

# checks if the number of arguments is different to 2 and 3

STANDARD_OUTPUT_FORMAT="obj"
STANDARD_CONVERTER_TAG="-assimp"

rm_log(){
    [ ! -f $1 ] || rm $1
}

if [ $# != 1 ] && [ $# != 2 ] && [ $# != 3 ]; then
    echo " usage: $0 file_to_convert [output_format]"
else 
    INPUT_FILE_PATH="$1"
    INPUT_FILE="${INPUT_FILE_PATH##*/}"
    INPUT_NAME="${INPUT_FILE%.*}"

    # checks for input number 2
    OUTPUT_FORMAT="$2"
    [ $2 ] || OUTPUT_FORMAT="$STANDARD_OUTPUT_FORMAT"
    OUTPUT_EXT="$OUTPUT_FORMAT"

    # checks for input number 3
    CONV_TAG="$3"
    [ $3 ] || CONV_TAG="$STANDARD_CONVERTER_TAG"

    # gltf2 fiels have gltf extension
    if [ $OUTPUT_EXT == "gltf2" ]; then
        OUTPUT_EXT="gltf"
    fi
    OUTPUT_FOLDER="${OUTPUT_EXT}s"

    # checks if a  folder exist or creates one
    [ -d $OUTPUT_FOLDER ] || mkdir $OUTPUT_FOLDER || break

    # output full path
    OUTPUT="./$OUTPUT_FOLDER/$INPUT_NAME$CONV_TAG.$OUTPUT_EXT"

    # assimp binding
    ASSIMP="assimp"
    ASSIMP_CALL="$ASSIMP export $INPUT_FILE_PATH $OUTPUT -f$OUTPUT_FORMAT"

    # ifcConvert binding
    IFCCONVERT="./converters_bin/IfcConvert-mac-0.4-64"
    IFCCONVERT_CALL="$IFCCONVERT $INPUT_FILE_PATH $OUTPUT"

    # logfile
    LOG_FILE_NAME=$(date +"%F_%T")
    LOG_FILE="./${OUTPUT_FOLDER}/${INPUT_NAME}${CONV_TAG}_$LOG_FILE_NAME.log"

    OLD_LOG_FILE="./$OUTPUT_FOLDER/$INPUT_NAME$CONV_TAG*.log"
    RM_OLD_LOG_FILE="rm $OLD_LOG_FILE"

    if [ $# -eq 3 ]; then
        if [ $3 == "-ifcConvert" ] || [ $3 == "-ifcconvert" ]; then
            rm_log $OLD_LOG_FILE
            $IFCCONVERT_CALL > $LOG_FILE
            
        elif [ $3 == "-assimp" ]; then
            rm_log $OLD_LOG_FILE
            $ASSIMP_CALL > $LOG_FILE
        else
            echo "error: converter $3 not recognized"
        fi
    else
        # if there are only 2 arguments
        rm_log $OLD_LOG_FILE
        $ASSIMP_CALL > $LOG_FILE
    fi
    echo "\n$INPUT_FILE_PATH => $OUTPUT"
fi