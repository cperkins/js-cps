/*
 * JS-CPS
 * Javascript CPS Transform
 *
 * cps_shell.js 
 * 
 * Version: '0.1'
 *
 * (c) 2011-2012 Chris Perkins
 *
 * This file is licensed under the terms of the MIT License:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */


/*
	this is the shell converter for js-cps
	
	call it to convert the t {CPS:xxx} tokened Javascript  to "real" CPS call-style Javascript.  
	
	
	/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc cps_shell.js -- "`cat somefile.cps`"
*/

if (!arguments[0]) {
    print('usage:\n $ jsc cps_shell.js -- "`cat somefile.cps`"');
    quit();
}

load('js-cps.js');

print(transform_cps(arguments[0]));