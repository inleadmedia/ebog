(function ($) {
  $('.ebog-dlink').live('click', function() {
    $('#ting-download-popup-info').dialog('close');
  });
  
  var href = '';

  // Handle clicked loan link, those matching 'ting/object/%/download' pattern
  $(document).ready(function() {
    $('a').live('click', function() {
      href = $(this).attr('href');
      if (!href.match(/ting\/object\/(.)+\/download/)) {
        return true;
      }

      var clicked = $(this);

      clicked.parent().find('.ajax-loader').remove();
      clicked.hide();
      clicked.parent().append('<div class="ajax-loader"></div>');

      $.ajax({
        type : 'post',
        url : href + '/popup',
        dataType : 'json',
        success : function(response) {
          $('#ting-download-popup').remove();
          clicked.parent().find('.ajax-loader').remove();
          clicked.show();
          
          if (response.status == 'err') {

            $('<div id="ting-download-popup" title="' + response.title + '">' + response.content + '</div>').dialog({
              modal : true,
              width: 'auto',
              height: 'auto',
              buttons: {
                "OK" : function() {
                  $('#ting-download-popup').dialog('close');
                }
              }
            });

            return;
          }
          
          $('<div id="ting-download-popup" title="' + response.title + '">' + response.content + '</div>').dialog({
            modal : true,
            width: 'auto',
            height: 'auto',
            buttons: {
              "Videre til download" : function() {
                if (!check_rules()) {
                  $('#ting-download-popup').dialog('close');
                }
              }
            }
          });
        }
      });

      return false;
    });

    // Check those checkboxes
    var check_rules = function() {
      var boxes = $('.ebog-download-confirm').find('input[type=checkbox]');
      if (boxes.length == boxes.filter(':checked').length) {
        $.ajax({
          type : 'post',
          url : href + '/request',
          dataType : 'json',
          success : function(response) {
            $('#ting-download-popup').dialog('close');
            $('#ting-download-popup-info').remove();
            $('<div id="ting-download-popup-info" title="' + response.title + '">' + response.content + '</div>').dialog({
              modal : true,
              width: 'auto',
              height: 'auto',
            });
          }
        });
      }
      else {
        $('#ting-download-popup-error').remove();
        $('<div id="ting-download-popup-error" title="' + Drupal.t('Fejl') + '"><p>' + Drupal.t('Check all checkboxes') + '</p></div>').dialog({
          modal : true,
          width: 'auto',
          height: 'auto',
          buttons: {
            "OK" : function() { $(this).dialog('close'); }
          }
        });

        return true;
      }

      return false;
    }
  });
})(jQuery);
