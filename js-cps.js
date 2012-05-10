/*
 * JS-CPS
 * Javascript CPS Transform
 * 
 * Version: '0.1'
 *
 * (c) 2010-2011 Chris Perkins
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
 	STANDARD INCLUSION is something like this:
 
 		<script src="jquery_1.5.2_min.js"></script>
		<script src="js-cps.js"></script>
		<script>$(document).ready(function(){ convert_all_js_cps(false); });</script>
		
*/



/* convert_all_js_cps(all) 

	DEPENDS ON: DOM / jQuery
	
	RETURNS:  nothing, used for side effects
	
	PUBLIC
	
	This script runs through the DOM looking for all <script type="text/js-cps"> blocks.
	
	It performs the CPS transform on them, making them regular JavasScript which is attached to the DOM.
	
	
	all -- if true then all <script> elements will be converted. If false or undefined, only those with type="text/js-cps" are converted.

*/
function convert_all_js_cps(all)
{
    if(typeof all === 'undefined'){ all = false; }
	var cps_scripts = all ? $('script') : $('script[type="text/js-cps"]');
	var i, cps, the_str, the_transform;
	for(i=0; i < cps_scripts.length; i++) //>
	{
		cps = cps_scripts[i];
		
		if(cps.src)
		{
			options = {success:function(some_str)
				              { var some_transform = transform_cps(some_str);
				                $("body").append($("<script />", {html: some_transform})); }};
			$.ajax(cps.src, options);
		}
		else
		{
			the_str = $(cps).html();
		}
		the_transform = transform_cps(the_str);
		
		//window.prompt ("Copy to clipboard: Ctrl+C, Enter", the_transform);
		
		//apply it
	    $("body").append($("<script />", {html: the_transform}));
		
	}
}


/*
	transform_cps(str)
	
	DEPENDS ON:   nothing   (RegExp)
	
	RETURNS: a transformed string.   Performs no side effects.  Recurses.
	
	PUBLIC
	 
	This function converts a string with the {CPS:xxx} tokens into Continuation Passing Style Javascript. 
*/
function transform_cps(str)
{
	/* -- without question, using Regex for this transformation is not ideal. My kingdom for a Lisp -- */
	
	//  /{\s*CPS\s*:\s*(\w*)\s/
	var CPS_and_ERROR = new RegExp( /{\s*CPS\s*:\s*(\w*)\s*,\s*ERROR\s*:(.*?)}\s*\)\s*;/ );
	var CPS_only = new RegExp( /{\s*CPS\s*:\s*(\w*)\s*}\s*\)\s*;/ );
	
	var match = CPS_and_ERROR.exec(str);
	if(match){ str = transform_cps_via_double(str, match); return transform_cps(str); }
	
	match = CPS_only.exec(str);
	if(match){ str = transform_cps_via_single(str, match); return transform_cps(str); }
	
	return str;
}

/*
	transform_cps_via_single(str, match)
	
	DEPENDS ON: nothing
	
	RETURNS: a transformed string
	
	PRIVATE
	
	This function takes a string and the matching RegExp match/array and converts the {CPS:xxx} token and the following code
	into continuation passing style JS.

*/
function transform_cps_via_single(str, match)
{
	/* match =>  
	    Array[2]
		0:"{CPS:xx} );"
		1:"xx"
		index:81
		input: "the whole string"
		length:2
	*/
	
	var post_string = str.substring( match.index + match[0].length );    //console.log('post_string: ' , post_string);
	var parent_close_brace = find_closing_brace_pos(post_string, 1, 0);  //console.log('close brace found: ', parent_close_brace, '  ', post_string.substring(parent_close_brace));
	var fstring = post_string; var closing_string = "";
	if(parent_close_brace > 0)
	{
		fstring = post_string.substring(0, parent_close_brace -1);
		closing_string = post_string.substring(parent_close_brace);
	}else if (parent_close_brace === 0){ fstring = ""; }
	
	var finalString = str.substring(0, match.index)
		           + 'function(' + match[1] + '){\n'
		           + fstring + '});\n' 
		           + closing_string;
		           
	//console.log('finalString: ' , finalString);
		           
	return finalString;
}


/*
	transform_cps_via_double(str, match)
	
	DEPENDS ON: nothing
	
	RETURNS: a transformed string
	
	PRIVATE
	
	This function takes a string and the matching RegExp match/array and converts the {CPS:xxx, ERROR:fname} token and the following code
	into continuation passing style JS.

*/
function transform_cps_via_double(str, match)
{
	/* match =>
		Array[3]
		0: "{CPS:zz, ERROR;errorh});"
		1: "zz"
		2: "errrorh"
		index: 504
		input: "the whole string"
		length: 3
	*/
	var post_string = str.substring( match.index + match[0].length );    //console.log('post_string: ' , post_string);
	var parent_close_brace = find_closing_brace_pos(post_string, 1, 0);  //console.log('close brace found: ', parent_close_brace, '  ', post_string.substring(parent_close_brace));
	var fstring = post_string; var closing_string = "";
	if(parent_close_brace > 0)
	{
		fstring = post_string.substring(0, parent_close_brace -1);
		closing_string = post_string.substring(parent_close_brace);
	}else if (parent_close_brace === 0){ fstring = ""; }
	
	var finalString = str.substring(0, match.index)
		           + 'function(' + match[1] + '){\n'
		           + fstring + '}, ' 
		           //error
		           + match[2] +');\n'
		           + closing_string;
		           
	//console.log('finalString: ' , finalString);
		           
	
	
	return finalString;
}

/*
	PRIVATE
*/
function find_closing_brace_pos(str, debt, in_already)
{ //given an _open_ string, finds the closing brace
  //thus " {  } } hi}"
  //            ^ 
  //            | this one
  
  var openBraceLoc = str.indexOf('{');
  var closeBraceLoc = str.indexOf('}');
  if(closeBraceLoc === -1){ return -1; }
  if(openBraceLoc === -1 || closeBraceLoc < openBraceLoc)  //>
  {
  	debt--;
  	if(debt === 0){ return in_already + closeBraceLoc; }
  	in_already += closeBraceLoc + 1;
  	return find_closing_brace_pos( str.substring(closeBraceLoc + 1), debt, in_already);
  }
  else
  {
  	debt++;
  	in_already += openBraceLoc + 1;
  	return find_closing_brace_pos( str.substring(openBraceLoc + 1), debt, in_already);
  }
}
