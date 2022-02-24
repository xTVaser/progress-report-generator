jQuery(document).ready(function() {


	if (jQuery(window).width() <= 1260) {jQuery(".blog-post").css({width: "80%"});}
     else if (jQuery(window).width() >= 1600){jQuery(".blog-post").css({width: "90%"});}
		else {jQuery(".blog-post").css({width: "86%"});
		 
		}  
                            }
						
							); 

jQuery( window ).resize(function() {
	if (jQuery(window).width() <= 1260) jQuery(".blog-post").css({width: "80%"});
     else if (jQuery(window).width() >= 1600){jQuery(".blog-post").css({width: "90%"});}
     
		else {jQuery(".blog-post").css({width: "86%"});}               


                            }); 