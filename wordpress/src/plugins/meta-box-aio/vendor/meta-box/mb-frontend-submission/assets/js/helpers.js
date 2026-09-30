const $ = jQuery;

const getFormData = form => window[ 'MBFS_Data_' + $( form ).find( 'input[name="mbfs_key"]' ).val() ] || {};

const addLoading = $btn => $btn.append( '<div class="rwmb-loading"></div>' );
const removeLoading = () => $( '.rwmb-loading' ).remove();
const scrollTo = $el => $( 'html, body' ).animate( { scrollTop: $el.offset().top - 50 }, 200 );
const redirect = url => setTimeout( () => window.location.href = url, 2000 );

const checkRecaptcha = ( { form, success, error } ) => {
	const data = getFormData( form );

	grecaptcha.ready( () => grecaptcha.execute( data.captchaKey, { action: 'mbfs' } ).then( success ).catch( error ) );
};

const turnstileWidgets = new Map();

const initTurnstile = form => {
	if ( typeof turnstile === 'undefined' ) {
		return;
	}

	const container = form.querySelector( '.mbfs-turnstile' );

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
		action: 'mbfs',
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

const resetTurnstile = form => {
	if ( typeof turnstile === 'undefined' ) {
		return;
	}

	const formId = form?.id;
	const widgetId = formId ? turnstileWidgets.get( formId ) : undefined;

	if ( undefined === widgetId ) {
		return;
	}

	turnstile.reset( widgetId );
};

// Save editor content for ajax submission.
function saveEditorContent() {
	var id = $( this ).attr( 'id' );

	$( document ).on( 'tinymce-editor-init', ( event, editor ) => {
		editor.on( 'input keyup', () => editor.save() );
	} );
}

$( function() {
	$( '.rwmb-wysiwyg' ).each( saveEditorContent );
} );

export { addLoading, getFormData, removeLoading, scrollTo, redirect, checkRecaptcha, checkTurnstile, initTurnstile, resetTurnstile };
