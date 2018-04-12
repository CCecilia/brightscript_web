const tutorial = {
    cover_title: null,
    cover_image: null,
    cover_description: null,
    steps: [],
    published: false,
    category: null
};

let order_number = 1;

// Create Tutorial: save tut
function saveTutorial(tutorial) {
    $.ajax({
        type: "POST",
        url: "/admin/tutorials/update/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(tutorial),
        success: (callback) => {
            if( callback.status === 200 ){
                tutorial._id = callback.tutorial_id;

                $.notify({
                    message: 'Tutorial Updated'
                },{
                    type: 'success'
                });
            } else {
                $.notify({
                    message: callback.error_msg
                },{
                    type: 'success'
                });
            }
        },
        fail: () => {
            $.notify({
                message: 'unknown server error'
            },{
                type: 'danger'
            });
        }
    });
}

// Create Tutorial: step
function tutorialStep(title, description, order_number, image='/images/roku.png') {
    this.title = title;
    this.description = description;
    this.order_number = order_number;
    this.image = image;
}

// Global
function inputError(input) {
    input.css('border', '1px solid red').focus();
    setTimeout(() => {
        input.css('border', '');
    }, 3000);
}

// Create Tutorial: Edit step
function editStep(step_id) {
    for( let i = 0; i < tutorial.steps.length; i++ ){
        if( tutorial.steps[i].order_number === step_id ) {
            // Alter add step
            $( '#tutorial-step .card-header h3' ).text('Edit Step');
            $( '#step-image-data' ).val(tutorial.steps[i].image);
            $( 'input[name="step_title"]' ).val(tutorial.steps[i].title);
            $( 'textarea[name="step_description"]' ).val(tutorial.steps[i].description);
            $( '#save-edit-tutorial-step, #add-tutorial-step, #cancel-edit-tutorial-step' ).toggle();
            $( '#save-edit-tutorial-step' ).attr('data-id', step_id);
        }
    }
}

// Create Tutorial: reset step card
function resetStepCard() {
    // Reset Add step card
    $( '#tutorial-step .card-header h3' ).text('Add A Step');
    $( '#step-image-data' ).val('');
    $( 'input[name="step_title"]' ).val('');
    $( 'textarea[name="step_description"]' ).val('');
    $( '#save-edit-tutorial-step, #add-tutorial-step, #cancel-edit-tutorial-step' ).toggle();
    $( '#save-edit-tutorial-step' ).attr('data-id', '');
}

// Create Tutorial: Remove step
function removeStep(step_id) {
    for( let i = 0; i < tutorial.steps.length; i++ ){
        if( tutorial.steps[i].order_number === step_id ) {
            // remove steps
            tutorial.steps.splice(i, 1);
        }
    }

    // reset order_numbers
    let reset_count = 0;

    for( let i = 0; i < tutorial.steps.length; i++ ){
        tutorial.steps[i].order_number === reset_count;
        reset_count ++;
    }

    order_number = reset_count;
    console.log(tutorial, order_number);
}

$(document).ready(function() {
    // Tutorials: table
    let tutorial_table = $( '#tutorial-table' ).DataTable( {
        stateSave: true,
    });

    // Tutorials: table row click
    $( '#tutorial-table tbody' ).on('click', 'tr', function() {
        let data = tutorial_table.row( this ).data();
        // redirect
        window.location = window.location.protocol + "//" + window.location.host + "/admin/tutorials/"+data[0]
    });

    // Create Tutorial: Handle cover image
    $( '#cover-image' ).on('change', (e) => {
        // get file
        let cover_image = document.getElementById('cover-image').files[0];

        // covert to base64
        let reader = new FileReader();
        reader.onloadend = () => {
            // save to tutorial on front
            tutorial.cover_image = reader.result;
            $.notify({
                message: 'Image Added'
            },{
                type: 'success'
            });
        }
        reader.readAsDataURL(cover_image);
    });

    // Create Tutorial: Add Cover
    $( '#add-tutorial-cover' ).click((e) => {
        // check title
        let cover_title_input = $('input[name="cover_title"]');
        let cover_description_input = $('textarea[name="cover_description"]');

        if( !cover_title_input.val() ) {
            inputError(cover_title_input);
            return;
        } else {
            // Add title to tutorial
            tutorial.cover_title = cover_title_input.val();
        }

        if( !cover_description_input.val() ) {
            inputError(cover_description_input);
            return;
        } else {
            // Add description to tutorial
            tutorial.cover_description = cover_description_input.val();
        }

        // Set img to default if not
        if( !tutorial.cover_image ) {
            tutorial.cover_image = '/images/roku.png';
        }

        // handle animations
        $( '#tutorial-cover' ).animate({
            width: '33%',
            left: '33%',
            opacity: '.3'
        });
        $( '#tutorial-cover' ).fadeOut(400, () => {
            $( '#cover-title' ).text(tutorial.cover_title);
            $( '#cover-image-saved' ).attr('src', tutorial.cover_image);
            saveTutorial(tutorial);
            $( '#tutorial-cover-saved' ).fadeIn(1000);
            $( '#tutorial-step' ).slideDown(1000);
        });

        // set focus to step title
        $( 'input[name="step_title"]' ).focus();
    });

    // Create Tutorial: Edit cover
    $( '#edit-tutorial-cover' ).click((e) => {
        $( '#tutorial-cover-saved' ).fadeOut(1000);
        $( '#tutorial-step' ).slideUp(1000);
        $( '#tutorial-cover' ).fadeIn(400);
        $( '#tutorial-cover' ).animate({
            width: '100%',
            left: '',
            opacity: '1'
        });
    });

    // Create Tutorial: Handle step image
    $( '#step-image' ).on('change', (e) => {
        // get file
        let step_image = document.getElementById('step-image').files[0];

        // covert to base64
        let reader = new FileReader();
        reader.onloadend = () => {
            // save to image string to hidden input
            $('#step-image-data').val(reader.result);
            $.notify({
                message: 'Image Added'
            },{
                type: 'success'
            });
        }
        reader.readAsDataURL(step_image);
    });

    // Create Tutorial: Add Step
    $( '#add-tutorial-step' ).click((e) => {
        let title_input = $( 'input[name="step_title"]' );
        let description_input = $( 'textarea[name="step_description"]' );
        let image_input = $( '#step-image-data' );

        // validate inputs
        if( !title_input.val() ) {
            inputError(title_input);
            return;
        }

        if( !description_input.val() ) {
            inputError(description_input);
            return;
        }

        // create new step
        let step = new tutorialStep(title_input.val(), description_input.val(), order_number);

        // add image if existing
        if( $('#step-image-data').val() ) {
            step.image = $('#step-image-data').val();
        }

        // add step to tutorial
        tutorial.steps.push(step);

        // increment step order count
        order_number ++;

        // reset inputs
        title_input.val('');
        description_input.val('');
        $('#step-image-data').val('');

        // add html
        let step_html = `
            <div class="col-md-3 clickable">
                <div class="card tutorial-step-saved" data-id="${step.order_number}">
                    <div class="card-header text-center">
                        <h3 class="text-center roku-font step-title" data-id="${step.order_number}">${step.title}</h3>
                        <label class="disabled order_number" data-id="${step.order_number}">Step ${step.order_number}</label>
                    <div class="card-body">
                        <div class="row">
                            <img class="step-image" src="${step.image}" data-id="${step.order_number}"/>
                            <button class="btn btn-warning card-btn clickable" onclick="editStep(${step.order_number})">Edit</button>
                            <button class="btn btn-danger card-btn clickable"  onclick="removeStep(${step.order_number})">Remove</button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        `;

        $( '#tutorial' ).append(step_html);

        // Save data
        saveTutorial(tutorial);

        // set focus to step title
        $( 'input[name="step_title"]' ).focus();
        console.log(tutorial);
    });

    // Create Tutorial: Save Edit step
    $( '#save-edit-tutorial-step' ).click(function (e) {
        let step_id = $(this).attr('data-id');

        // Update step
        for( let i = 0; i < tutorial.steps.length; i++ ){
            if( tutorial.steps[i].order_number === step_id ) {
                tutorial.steps[i].image = $( '#step-image-data' ).val();
                tutorial.steps[i].title = $( 'input[name="step_title"]' ).val();
                tutorial.steps[i].description = $( 'textarea[name="step_description"]' ).val();
            }
        }

        // update step Card
        $( `.step-title[data-id=${step_id}]` ).text($( 'input[name="step_title"]' ).val());
        $( `.step-image[data-id=${step_id}]` ).attr('src', $( '#step-image-data' ).val());

        // Save Edits/ Reset Card
        saveTutorial(tutorial);
        resetStepCard();
    });

    // Create Tutorial: Cancel Edit step
    $( '#cancel-edit-tutorial-step' ).click( (e) => {
        resetStepCard();
    });

    // Create Tutorial: Publish
    $( '#publish-tutorial' ).click( (e) => {
        if( !tutorial._id ) {
            $.notify({
                message: 'Tutorial has no data'
            },{
                type: 'danger'
            });
            return;
        }

        if( !tutorial.category ) {
            $.notify({
                message: 'Tutorial needs a category first'
            },{
                type: 'info'
            });
            return;
        }

        // publish
        tutorial.published = true;

        // Save data
        saveTutorial(tutorial);

        // toggle btns
        $( '#publish-tutorial, #unpublish-tutorial').toggle();
    });

    // Create Tutorial: Unpublish
    $( '#unpublish-tutorial' ).click( (e) => {
        if( !tutorial._id ) {
            $.notify({
                message: 'Tutorial has no data'
            },{
                type: 'danger'
            });
        }

        // publish
        tutorial.published = false;

        // Save data
        saveTutorial(tutorial);

        // toggle btns
        $( '#publish-tutorial, #unpublish-tutorial').toggle();
    });

    // Create Tutorial: category pick
    $( '#tutorial-category-picker' ).on('change', function (e) {
        if( !tutorial._id ) {
            $.notify({
                message: 'Tutorial has no data'
            },{
                type: 'danger'
            });
        }

        tutorial.category = $( '#tutorial-category-picker option:selected' ).val();
        console.log(tutorial);

        // Save data
        saveTutorial(tutorial);
    });

    // Categories: table
    let category_table = $( '#category-table' ).DataTable( {
        stateSave: true,
    });

    // Categories: table row click
    $( '#category-table tbody' ).on('click', 'tr', function() {
        let data = category_table.row( this ).data();
        console.log(`tutorial: ${data[0]}`);
        // window.location = window.location.protocol + "//" + window.location.host + "/retailEnergyProviders/details/"+data[0]
    });

    // Categories: create form
    $( 'form[name="create_category"]' ).submit(function (e) {
        // stop submission
        e.preventDefault();

        // serialize/send form
        $.ajax({
            type: "PUT",
            url: $( this ).attr('action'),
            data: $( this ).serialize(),
            success: (callback) => {
                if( callback.status === 200 ){
                    // refresh table
                    location.reload();
                } else {
                    // notify error
                    $.notify({
                        message: callback.error_msg
                    },{
                        type: 'danger'
                    });
                }
            },
            fail: () => {
                // notify error
                $.notify({
                    message: 'unknown server error'
                },{
                    type: 'danger'
                });
            }
        });
    });

    // References: table
    let reference_table = $( '#reference-table' ).DataTable( {
        stateSave: true,
    });

    // Categories: table row click
    $( '#reference-table tbody' ).on('click', 'tr', function() {
        let data = reference_table.row( this ).data();
        console.log(`reference: ${data[0]}`);
        // window.location = window.location.protocol + "//" + window.location.host + "/retailEnergyProviders/details/"+data[0]
    });

    // Categories: create form
    $( 'form[name="create_reference"]' ).submit(function (e) {
        // stop submission
        e.preventDefault();

        // serialize/send form
        $.ajax({
            type: "PUT",
            url: $( this ).attr('action'),
            data: $( this ).serialize(),
            success: (callback) => {
                if( callback.status === 200 ){
                    // refresh table
                    location.reload();
                } else {
                    // notify error
                    $.notify({
                        message: callback.error_msg
                    },{
                        type: 'danger'
                    });
                }
            },
            fail: () => {
                // notify error
                $.notify({
                    message: 'unknown server error'
                },{
                    type: 'danger'
                });
            }
        });
    });
});
