jQuery.fn.applyClass = function (className, apply) {
    if (apply) {
        $(this).addClass(className);
    } else {
        $(this).removeClass(className);
    }
    return this;
};