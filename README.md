#JS-CPS

JS-CPS is a very simple JavaScript library for converting normal synchronous looking code into the Continuation Passing Style that is needed by modern AJAX Javascript.

Like CoffeeScript, JS-CPS can be used in one of two modes. You can either embed the transformer directly in your page, and then any `<script>` tags with `type="text/js-cps"` will automatically be converted. Or, you write your JS-CPS in external .cps files and run a shell script to convert them to .js files. The latter method is generally preferred.
	
##Quick Example
Let's say you have written a function named `get_server_data` and it uses a typical AJAX XmlHttpRequest to fetch something from a server. The important thing about this function is that it *last two arguments* are a success callback function and an error callback function.  The success callback is called with one argument: the data that is retrieved.  The error callback argument is optional to our function. Don't worry about it now.

Here is the prototype for such a function:
    function get_server_data(url, datav, successf, errorf)

Now we need to ask the server if the user is logged in. And if they are, as the server for their last project id, if any. And, with that, ask the server for their project data. If the user is not logged in or there is not a project id, then we need to display some login or new project dialogs

Here is how that code might be written **without** JS-CPS

    function init()
    {
    	get_server_data('user_logged_in.php', null, 
    	  function(user_id)
    	  {
    	  	if(!user_id)
    	  	{
    	  		display_login();
    	  	}
    	  	else
    	  	{
    	  		get_server_data('get_project_id.php', null,
    	  		  function(project_id)
    	  		  {
    	  		  	if(!project_id)
    	  		  	{
    	  		  		display_new_project();
    	  		  	}
    	  		  	else
    	  		  	{
    	  		  		get_server_data('get_project_data.php', {user_id:user_id, project_id:project_id},
    	  		  		  function(project_data)
    	  		  		  {
    	  		  		  	display_project(project_data);
    	  		  		  });
    	  		  	}
    	  		  });
    	  	}
    	  });
    }
		
That's a lot of rightward drift!  And a lot of anonymous functions. And a lot of `});}});}`.

The code above is written in something called *Continuation Passing Style*.  Because AJAX calls are asynchronous ( a desirable feature ) whenever you encounter one, the "rest of the operation" (aka the Continuation) that you want to perform once the data is gotten must be wrapped in a callback handler. If you are regularly using jQuery `.ajax()` or `.getScript()` or Dojo's  `xhr` object, then you are writing Continuation Passing Style (CPS) code all the time.  This is the world we live in. Until now.

**JS-CPS** is a library for automatically converting seemingly synchronous code into the CPS style you see above.  It makes working with Ajax calls much easier.  Here is how you would write the above using JS-CPS:

	function init()
	{
		var user_id = get_server_data('user_logged_in.php', null, {CPS:user_id});
		if(!user_id)
		{
			display_login();
		}
		else
		{
			var project_id = get_server_data('get_project_id.php', null, {CPS:project_id});
			if(!project_id)
			{
				display_new_project();
			}
			else
			{
				var project_data = get_server_data('get_project_data.php', {user_id:user_id, project_id:project_id}, {CPS:project_data});
				display_project(project_data);
			}
		}
	}
	
At first blush the code looks synchronous, but it is not.  When run through JS-CPS, the code above will be automatically translated into the CPS style we saw in the first example. When converted it becomes the asynchronous non-blocking Ajaxy style dreck we all know and hate.

Because that CPS token is itself legal javascript, the pre-transformed JS-CPS code can still be vetted by your favorite code editor for coding mistakes. Stub functions can be used in place of your Ajax calls for testing.

##Getting Started

### Convert in browser or shell

Like CoffeeScript, JS-CPS can be used in one of two modes. You can either embed the transformer directly in your page, and then any `<script>` tags with `type="text/js-cps"` will automatically be converted. Or, you write your JS-CPS in external .cps files and run a shell script to convert them to .js files. The latter method is generally preferred.
	
#### Embed Directly On Page

		<script src="jquery_1.5.2_min.js"></script>    
		<script src="js-cps.js"></script>
		<script>$(document).ready(function(){ convert_all_js_cps(false); });</script>
		
JS-CPS requires jQuery.  Obviously, adjust any needed paths.  The last statement runs the conversion script. It'll convert any `<script type="text/js-cps">` elements it finds. Those scripts can be inline or refer to external files.
	
#### Using Shell Script *(OS X)*
Place the entire **js-cps** directory in the root of your project directory. 
You'll be writing .cps files (example *something-fancy.cps*), but your `script` tags will refer to files with both a .cps and .js extension. (example: `<script src="something-fancy.cps.js">`)
	
Note we do **NOT** use the `type="text/js-cps"` script type.  That is only used when embedding the converter on a page, not when using the shell script.

To transform your .cps files to their .cps.js variants, simply cd to `your_project/js-cps/` and execute `transform_project.sh`

The shell script will run and find all .cps files in your project directory and output matching .cps.js files

Note that the shell script requires the Mac JavaScript command line tool (JSC) to execute. (which comes preinstalled with every Mac)


##Using
the transform is pretty straightfoward.  Whenever something like this is discovered:

	   some_fancy_function( arg, {CPS:var_name} );
	   ....more commands
	   ....and maybe more
	 } // <= the closing brace of the immediate environment where some_fancy_function is located
	
It becomes this:

		some_fancy_function( arg, function(var_name)
		                          {
		                          	....more commands
		                          	....and maybe more
		                          });
		} // <= the closing brace of the immediate environment where some_fancy_function was located.
		
+ The `{CPS:var_name}` token is replaced by a callback.
+ The `{CPS:var_name}` token should always be the **last argument** of the function it is in.
+ The function where you are using the `{CPS:var_name}`  token should expect a callback as its last argument.
+ `var_name` is specified in `{CPS:var_name}` and then used as the argument to the callback function.
+ *Everything* that is between `some_fancy_function( arg, {CPS:var_name} );` and the *closing brace of the immediate environment* is placed into the callback.

Tip: even though in the final code it is irrelevant, it's nice for readability to use `var var_name = ` right before the call to fancy function.

		var mission_status = some_fancy_function(arg, {CPS:mission_status});
		if(mission_status === 0){ abort_mission(); }
		
		
###Error Handling
Not every AJAX call can be expected to succeed. There are different strategies for handling errors. Here are two
####Pass null data to callback
In this variant on our example function, the callback is called with null if there is an error:

	  //requires jQuery
	  function get_server_data_v2(url, datav, successf)
	  {
		var options = datav ? {data:datav} : {};
		options.success = successf;
		<b>options.error = function(){ successf(null); };</b>
	
		$.ajax(url, options);
	  }
####ERROR callback
The CPS token supports a second argument for specifying the name of an error callback handler. In this case, the function should expect **two** last arguments. The success callback and the error callback.

Before transformation the code looks like this:

	some_fancy_function( arg, {CPS:var_name, ERROR:error_f_name} );
	  ....more commands
	  ....and maybe more
	} //<= the closing brace of the immediate environment where some_fancy_function is located.
	
It becomes this:

	some_fancy_function( arg, function(var_name)
	                          {
	                          	....more commands
	                          	....and maybe more
	                          }, error_f_name);
	} //<= the closing brace of the immediate environment where some_fancy_function was located.
	
##### no inline error handler
`error_f_name` is the **name** of a variable or function.  It **cannot** be an inline function. It *can* be an anonymous function if you first assign it to a variable and set ERROR to that variable name.
######GOOD
		var errorh = function(obj, status, text){ console.log('error thrown: ', status, text); };
		var zz = get_server_data('thisurldoesnotexist.php', null, {CPS:zz, ERROR:errorh});
######BAD
	var zz = get_server_data('thisurldoesnotexist.php', null, {CPS:zz, ERROR:function(obj, status, text){ console.log('error thrown: ', status, text); }});

##### more notes
+where the ``{CPS:var_name, ERROR:error_f_name}`` token is used, the function should expect **two** last arguments
+in the CPS token, `CPS:` must come **before** `ERROR:`


For those using jQuery, this variant of `get_server_data` can accept either one last argument or two.  In the case where it receives one, it calls the success callback with null. Thus you can use this function for either error handling strategy.

	function get_server_data(url, datav, successf, errorf)
	{
		var options = datav ? {data:datav} : {};
		options.success = successf;
		if(typeof errorf === 'undefined')
		{	
			options.error = function(){ successf(null); };
		}
		else
		{
			options.error =  errorf;
		}
		$.ajax(url, options);
	 }
	
###Gotcha: the "immediate environment"
The continuation that is wrapped into the callback is just out to the end of the immediate environment (nesting) of the function call where it occurs. This may be shorter than what you need in some circumstances.

		var data;
		if(!remote)
		{
			data = ["1", "2", "3"];
		}
		else
		{
			data = get_server_data('dataneeded.php', null, {CPS:data});
		} <== the <b>environment</b> ends here. 
		var i;                           <=
		for(i=0; i< data.length; i++)    <=    
		{                                <=   NONE OF THIS WILL BE PART OF THE CALLBACK / CONTINUATION
		     do_something(data[i]);      <=  
		}
		
		
## Credits & License
Copyright  © 2011-2012 Chris Perkins

JS-CPS is licensed under the MIT license.  Which pretty much means you can use it however you like.
Please contribute to its continued success on GitHub. If you use it, it'd be cool to let me know.