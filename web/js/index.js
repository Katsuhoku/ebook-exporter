function setDisabled(state) {
    captureButton = $("#export-button");
    captureButton.prop("disabled", state);
    if (state) {
        captureButton.removeClass("btn-success");
        captureButton.addClass("btn-danger");
    }
    else {
        captureButton.removeClass("btn-danger");
        captureButton.addClass("btn-success");
    }
}

$(document).ready(() => {
    eel.log("Starting");

    $("#folder-button").click(() => {
        var lastPath = $("#folder-input").val();
        eel.select_folder()(path => {
            if (path) $("#folder-input").val(path);
            else $("#folder-input").val(lastPath);
        }); 
    });

    $("#export-button").click(() => {
        var infoField = $("#info-text");
        infoField.empty();

        var pages = parseInt($("#pages-input").val());
        var folder = $("#folder-input").val();

        
        if (pages && folder) {
            infoField.append("<p class='text-warning'>Capturing... DON'T TOUCH ANYTHING (seriously...)</p>");
            setDisabled(true);
            eel.capture(pages, folder)(code => {
                infoField.empty();
                if (code == 1) {
                    infoField.append("<p class='text-success'>Book exported successfully!</p>");
                    setDisabled(false);

                    if ($('#save-pdf').is(':checked')) {
                        infoField.append("<p class='text-primary'>Exporting to PDF...</p>");
                        setDisabled(true);
                        eel.export_pdf(folder)(code => {
                            if (code == 2) {
                                infoField.empty();
                                infoField.append("<p class='text-success'>Book exported successfully to PDF!</p>");
                                setDisabled(false);
                            }
                            else {
                                infoField.append("<p class='text-danger'>An unexpected error ocurred exporting to PDF. Verify all the fields or restart the program.</p>");
                            }
                        });
                    }
                }
                else {
                    infoField.append("<p class='text-danger'>An unexpected error ocurred. Verify all the fields or restart the program.</p>");
                }
            });
        }
        else {
            console.log(pages);
            console.log(folder);
            if (!pages) infoField.append("<p class='text-danger'>Error: Invalid number of pages.</p>")
            if (!folder) infoField.append("<p class='text-danger'>Error: Invalid folder.</p>")
            infoField.append("<p class='text-danger'>Fill correctly all the fields and try again.</p>")
        }
    });
});