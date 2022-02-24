function InOut( elem )
{
 elem.delay()
     .fadeIn()
     .delay(6000)
     .fadeOut(
          function(){
             if(elem.next().length > 0) // if there is a next element
                
               {InOut( elem.next() );} // use it
             else
               {InOut( elem.siblings(':first'));} // if not, then use go back to the first sibling

           }
         );
}

jQuery(function(){
jQuery('#git li').hide();
InOut( jQuery('#git li:first') );
jQuery('#forum li').hide();
InOut( jQuery('#forum li:first') );
jQuery('#youtube li').hide();
InOut( jQuery('#youtube li:first') );

});

