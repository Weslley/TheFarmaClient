jQuery.fn.preventDoubleClick = function() {
  $(this).on('click', function(e){
    var $el = $(this);
    if($el.data('clicked')){
      e.preventDefault();
      e.stopPropagation();
    }else{
      // Mark to ignore next click
      $el.data('clicked', true);
      // Unmark after 1 second
      window.setTimeout(function(){
        $el.removeData('clicked');
      }, 3000)
    }
  });
  return this;
};