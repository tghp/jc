const $ = jQuery;

const getFormData = form => window[ 'MBUP_Data_' + $( form ).find( '[name^="mbup_key"]' ).val() ] || {};

const checkRecaptcha = ( { form, success, error } ) => {
	const data = getFormData( form );
	grecaptcha.ready( () => grecaptcha.execute( data.captchaKey, { action: 'mbup' } ).then( success ).catch( error ) );
};

const turnstileWidgets = new Map();

const initTurnstile = form => {
	if ( typeof turnstile === 'undefined' ) {
		return;
	}

	const container = form.querySelector( '.mbup-turnstile' );

	if ( ! container ) {
		return;
	}

	const formId = container.dataset.formId;
	const data = getFormData( form );

	if ( ! formId || ! data.captchaKey ) {
		return;
	}

	const widgetId = turnstile.render( container, {
		sitekey: data.captchaKey,
		action: 'mbup',
		'refresh-expired': 'auto',
	} );

	turnstileWidgets.set( formId, widgetId );
};

const checkTurnstile = ( { form, success, error } ) => {
	if ( typeof turnstile === 'undefined' ) {
		error();
		return;
	}

	const formId = form?.id;
	const widgetId = formId ? turnstileWidgets.get( formId ) : undefined;

	if ( undefined === widgetId ) {
		error();
		return;
	}

	const token = turnstile.getResponse( widgetId );

	if ( token ) {
		success( token );
		return;
	}

	error();
};

// Save editor content for ajax submission.
function saveEditorContent() {
	var id = $( this ).attr( 'id' );

	$( document ).on( 'tinymce-editor-init', ( event, editor ) => {
		editor.on( 'input keyup', () => editor.save() );
	} );
}

$( function () {
	$( '.rwmb-wysiwyg' ).each( saveEditorContent );
} );

export { checkRecaptcha, checkTurnstile, initTurnstile };
