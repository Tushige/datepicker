var datePickerObjMap = {};
function onFocusHandler(event) {
    let targetInput = event.target;
    let datePickerId = event.target.parentNode.id;
    if (!datePickerObjMap.hasOwnProperty(datePickerId)) {
        const d = new DatePicker(datePickerId, function(id, fixedDate) {
            targetInput.value = `${fixedDate.month}/${fixedDate.day}/${fixedDate.year}`;
            d.hide();
        });
        datePickerObjMap[datePickerId] = d;
        d.render(new Date());
    }
    //retrieve calendar in target datePicker
    const datePicker = datePickerObjMap[datePickerId];
    datePicker.show();
}
function onBlurHandler(event) {
    // let target = event.target;
    // let datePickerId = target.parentNode.id;
    // const datePicker = datePickerObjMap[datePickerId];
    // datePicker.hide();
}
