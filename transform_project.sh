#!/bin/bash


# JS-CPS
# Javascript CPS Transform
# 
# Version: '0.1'
#
# transform_project.sh
#
# (c) 2010-2011 Chris Perkins
#
# This file is licensed under the terms of the MIT License:
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
#


#assuming your project has this sort of structure, where  the js-cps directory is in the JS root.
# [ JS ROOT]
# - [js-cps]
# - - transform_project_cps.sh     <-- this script
# - - cps_shell.js                 <-- required
# - - js-cps.js                    <-- also required
# - [ other directories ]
# - - some.cps
# 
# - top.cps

# Then this shell script looks for all the .cps files nested anywhere under [ JS ROOT ]  and converts them to .js files.
# filename:  something.cps =>  something.cps.js

#test (works)
#/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc cps_shell.js -- "`cat test/transform_me_too.cps`" > test/transform_me_too.js


#actual loop

for y in `find .. -name *.cps`; do
#echo $y
NEWFNAME="$y.js"
echo $NEWFNAME
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc cps_shell.js -- "`cat $y`" > $NEWFNAME
done


