jQuery_T4NT(document).ready(function($) {

     /**
     *  Variant selection changed
     *  data-variant-toggle="{{variant.id}}"
     */
	   $( document ).on( "variant:changed", function( evt ) {
	     // console.log( evt.currentVariant );
	     // $('[data-variant-toggle]').hide(0);
	     // $('[data-variant-toggle="'+evt.currentVariant.id+'"]').show(0);
	   });
	   function setEqualHeight(columns){
		var tallestcolumn = 0;

		columns.each( function(){
		currentHeight = $(this).height();
		if(currentHeight > tallestcolumn){
		   tallestcolumn = currentHeight;
		}
		});

		columns.height(tallestcolumn);
	 }
	 setEqualHeight($(".grid__item"));
	 setEqualHeight($(".is--href-replaced"));
});
