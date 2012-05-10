/*
	this file uses cps transforms
*/

function load_some_more()
{
	var xx = get_server_data('creator.php', null, {CPS:xx} );
	console.log('received xx: ', xx);
	if(xx)
	{
		var yy = get_server_data('http://localhost:8888/js-playground/php/xy_json.php', {x:400, y:200}, {CPS:yy} );
		if(yy)
		{ 
			console.log('received yy: ', yy); 
			var errorh = function(obj, status, text){ console.log('error thrown: ', status, text); };
			var zz = get_server_data('http://localhost:8888/thisurldoesnotexist.php', null, {CPS:zz, ERROR:errorh});
			if(zz)
			{
				console.log('received zz: ', zz);
			}
		}
	}
}

