/***
 * Paypal jQuery code
 * @author Chris Hsu 26matrices@gmail.com
 * @version 0.8
 */

/** Options **/
var recurringOptions = [ 10, 25, 50, 100, 200 ];
var defaultRecurring = 50;
var onceOptions = [ 50, 100, 200, 500 ];
var defaultOnce = 200;
var monthlyOptions = [ 3, 6, 12, 24 ];
var yearlyOptions = [ 1, 2, 3, 5 ];
var form = "form#paypal";

/** Helper Functions **/
function createOptions(options, className) {
    for (i = 0; i < options.length; i++) {
        var option = $("<option/>").addClass(className).
            val(options[i]).text(options[i]);
        $("#donation_recur select[name=srt] option:last", form).before(option);
    }
}

function createAmountOptions(options, className) {
    for (i = 0; i < options.length; i++) {
        var option = $("<option/>").addClass(className).
            val(options[i]).text('$'+options[i]);
        $("#donation_amount option:last", form).before(option);
    }
}

function displayRecurring() {
    $("input[name=cmd]", form).val("_xclick-subscriptions");
    $("#donation_recur", form).show();
    $(".donation_once", form).remove();
    createAmountOptions(recurringOptions, "donation_recurring");
    $("#donation_amount select", form).val(defaultRecurring).
        trigger('change').attr('name', 'a3');
}

function displayOnce() {
    $("input[name=cmd]", form).val("_donations");
    $("#donation_recur", form).hide();
    $(".donation_recurring", form).remove();
    createAmountOptions(onceOptions, "donation_once");
    $("#donation_amount select", form).val(defaultOnce).
        trigger('change').attr('name', 'amount');
}

/** On Document Load.. **/
$(function() {
    $("#donation_amount", form).hide();
    $("#donation_recur", form).hide();
    $("#donation_amount_box", form).hide();
    $("input:radio[name=src]", form).prop('checked', false);
    
    $("input:radio[name=src]", form).change( function() {
        $("#donation_amount", form).show();
        if ($(this).val() == "1") {
            displayRecurring();
            $("#donation_recur select[name=t3]", form).trigger('change');
        } else {
            displayOnce();
            $(".monthly").remove();
            $(".yearly").remove();
        }
    });
    
    $("#donation_amount select", form).change( function() {
        if ($(this).val() == 0) {
            var attr = $(this).attr('name');
            $("#donation_amount_box", form).show();
            $("#donation_amount_other").attr('name', attr);
            $(this).attr('name', '');
            $("label[for=donation_amount_other]", form).text("");
        } else {
            var attr = $("#donation_amount_other", form).attr('name');
            $("#donation_amount_box", form).hide();
            $("#donation_amount_other").attr('name', '');
            $(this).attr('name', attr);
            $("label[for=donation_amount_other]", form).text("");
        }
    });
    
    $("#donation_recur select[name=t3]", form).change( function() {
        if ($(this).val() == 'M') {
            $(".yearly", form).remove();
            createOptions(monthlyOptions, 'monthly');
        } else {
            $(".monthly", form).remove();
            createOptions(yearlyOptions, 'yearly');
        }
    });
    
    $(form).submit( function(e) {
        if ($("#donation_amount select", form).val() == 0) {
            var val = $("#donation_amount_other", form).val();
            if (!isNaN(parseFloat(val)) && isFinite(val)) {
                return;
            } else {
                $("label[for=donation_amount_other]", form).
                    text("Not a number");
                e.preventDefault();
            }
        }
        $("input[name=item_name]").val('Shalom Donation - ' + $("#donation_to").val());
        return;
    });
});
