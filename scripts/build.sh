#!/bin/bash

rm -rf $PWD/dist
babel src --out-dir dist --ignore '**/*-integration.js' --source-maps inline
git reset
git add $PWD/dist
git commit -m 'Updating dist files' -n
