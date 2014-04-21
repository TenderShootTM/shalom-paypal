/** Options **/
var recurringOptions = [ 10, 25, 50 ];
var onceOptions = [ 25, 50, 100 ];
var form = "form#paypal";

/** Helper Functions **/
function createOptions(options, className) {
    for (i = 0; i < options.length; i++) {
        var option = $("<option/>").addClass(className).
            val(options[i]).text('$'+options[i]);
        $("#donation_amount option:last", form).before(option);
    }
}

function displayRecurring() {
    var options = recurringOptions;
    $("input[name=cmd]", form).val("_xclick-subscriptions");
    $("#donation_recur", form).show();
    $(".donation_once", form).remove();
    createOptions(options, "donation_recurring");
    $("#donation_amount", form).val(options[0]).
        trigger('change').attr('name', 'a3');
}

function displayOnce() {
    var options = onceOptions;
    $("input[name=cmd]", form).val("_donations");
    $("#donation_recur", form).hide();
    $(".donation_recurring", form).remove();
    createOptions(options, "donation_once");
    $("#donation_amount", form).val(options[0]).
        trigger('change').attr('name', 'amount');
}

/** On Document Load.. **/
$(function() {
    $("#donation_amount", form).hide();
    $("#donation_recur", form).hide();
    $("#donation_amount_other", form).hide();
    $("input:radio[name=srt]", form).prop('checked', false);
    
    $("input:radio[name=srt]", form).change( function() {
        $("#donation_amount", form).show();
        if ($(this).val() == "0") {
            displayRecurring();
        } else {
            displayOnce();
        }
    });
    
    $("#donation_amount", form).change( function() {
        if ($(this).val() == 0) {
            var attr = $(this).attr('name');
            $("#donation_amount_other", form).show().attr('name', attr);
            $(this).attr('name', '');
            $("label[for=donation_amount_other]", form).text("");
        } else {
            var attr = $("#donation_amount_other", form).attr('name');
            $("#donation_amount_other", form).hide().attr('name', '');
            $(this).attr('name', attr);
            $("label[for=donation_amount_other]", form).text("");
        }
    });
    
    $(form).submit( function(e) {
        if ($("#donation_amount", form).val() == 0) {
            var val = $("#donation_amount_other", form).val();
            if (!isNaN(parseFloat(val)) && isFinite(val)) {
                return;
            } else {
                // alert("not a number value!");
                $("label[for=donation_amount_other]", form).
                    text("Not a number");
                e.preventDefault();
            }
        } 
        return;
    });
});