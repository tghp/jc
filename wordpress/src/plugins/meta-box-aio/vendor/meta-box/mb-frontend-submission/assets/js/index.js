import { addLoading, getFormData, checkRecaptcha, initTurnstile, checkTurnstile, resetTurnstile, redirect, removeLoading, scrollTo } from './helpers.js';

const $ = jQuery;

function processForm() {
	const form = this;
	var $form = $( form );
	var $submitBtn = $form.find( 'button[name="rwmb_submit"]' );
	var $deleteBtn = $form.find( 'button[name="rwmb_delete"]' );
	var editText = $submitBtn.attr( 'data-edit' );
	var $validationElements = $form.find( '.rwmb-validation' );
	var countClick = 0;
	const i18n = getFormData( form );
	const isAjax = 'true' === i18n.ajax;

	// Set ajax URL for ajax actions like query images for image_advanced fields.
	if ( typeof window.ajaxurl === 'undefined' ) {
		window.ajaxurl = i18n.ajaxUrl;
	}

	// Initialize turnstile widget if needed.
	initTurnstile( form );

	const setAction = action => $form.find( 'input[name="action"]' ).val( `mbfs_${ action }` );
	const validate = () => {
		$( '#rwmb-validation-message' ).remove(); // Remove all previous validation message.
		return !$.validator || $form.valid();
	};

	// To prevent submitting twice.
	function disableButtons() {
		$submitBtn.prop( 'disabled', true );
		$deleteBtn.prop( 'disabled', true );
	}

	function enableButtons() {
		$submitBtn.prop( 'disabled', false );
		$deleteBtn.prop( 'disabled', false );
	}

	function submitCallback() {
		if ( isAjax ) {
			addLoading( $submitBtn );
			performAjax();
		} else {
			resetTurnstile( form );
			form.submit(); // Native form submit.
		}
	}

	function isRemote() {
		let remote = false;
		$validationElements.each( function () {
			const data = $( this ).data( 'validation' );
			if ( Object.values( data.rules ).find( rule => rule.remote ) ) {
				remote = true;
			}
		} );
		return remote;
	}

	function checkAjax() {
		return new Promise( ( resolve, reject ) => {
			$( document ).ajaxComplete( function ( event, request, settings ) {
				const $form = $( settings.context );

				if ( !$form.hasClass( 'mbfs-form' ) || $form.find( '.rwmb-error' ).length === 0 ) {
					resolve();
				}

				window.stop();
				enableButtons();

				if ( isAjax ) {
					removeLoading();
				}

				reject( 'Remote validation error' );
			} );
		} );
	}

	async function handleSubmitClick( e ) {
		try {
			countClick++;

			if ( i18n.captchaKey || isAjax ) {
				e.preventDefault();
			}

			// Do nothing when the form is not validated.
			if ( !validate() ) {
				return;
			}

			if ( countClick == 1 && isRemote() ) {
				await checkAjax();
			}

			disableButtons();
			setAction( 'submit' );

			const checkCaptcha = i18n.captchaKey ? ( 'turnstile' === i18n.captchaProvider ? checkTurnstile : checkRecaptcha ) : null;

			if ( ! checkCaptcha ) {
				submitCallback();
				return;
			}

			checkCaptcha( {
				form,
				success: token => {
					$form.find( 'input[name="mbfs_captcha_token"]' ).val( token );
					submitCallback();
				},
				error: () => {
					enableButtons();
					$form.find( '.rwmb-error' ).remove();
					displayMessage( 'turnstile' === i18n.captchaProvider ? i18n.captchaRequired : i18n.captchaExecuteError, false );
				}
			} );
		} catch ( err ) {
			console.log( err );
		}
	}

	function performAjax( callback ) {
		$( '.rwmb-confirmation' ).remove();

		let data = new FormData( form );
		data.append( '_ajax_nonce', i18n.nonce );

		$.ajax( {
			dataType: 'json',
			type: 'POST',
			data: data,
			url: i18n.ajaxUrl,
			contentType: false,
			processData: false
		} ).done( function ( response ) {
			removeLoading();
			enableButtons();
			displayMessage( response.data.message, response.success );

			if ( response.success && response.data.allowScroll == 'true' ) {
				scrollTo( $( '.rwmb-confirmation' ) );
			}

			if ( response.success && response.data.redirect ) {
				redirect( response.data.redirect );
			}

			if ( typeof callback === 'function' ) {
				callback( response );
			}
		} ).always( function () {
			// Reset the widget after every attempt (success or failure) so the token is never reused.
			resetTurnstile( form );
		} );
	}

	function displayMessage( message, success = true ) {
		if ( !success ) {
			message = `<div class="rwmb-confirmation rwmb-error">${ message }</div>`;
		}
		const isEdit = editText === 'true';

		if ( isEdit || !success ) {
			$form.prepend( message );
		} else {
			$form.replaceWith( message );
		}
	}

	function handleDeleteClick( e ) {
		if ( !confirm( i18n.confirm_delete ) ) {
			e.preventDefault();
			return;
		}

		disableButtons();
		setAction( 'delete' );

		const deleteCallback = () => {
			if ( !isAjax ) {
				form.submit(); // Native form submit. Chrome requires this to perform submitting the form.
				return;
			}

			// Remove row on dashboard: must get before performing Ajax because the form is removed.
			const $tr = $( e.target ).closest( '.mbfs-actions' ).parent();

			e.preventDefault();
			addLoading( $deleteBtn );
			performAjax( response => {
				if ( !$tr.length ) {
					return;
				}

				$tr.closest( 'table' ).before( `<div class="rwmb-confirmation">${ response.data.message }</div>` );
				$tr.remove();
			} );
		};

		const checkCaptcha = i18n.captchaKey ? ( 'turnstile' === i18n.captchaProvider ? checkTurnstile : checkRecaptcha ) : null;

		if ( ! checkCaptcha ) {
			deleteCallback();
			return;
		}

		e.preventDefault();

		checkCaptcha( {
			form: form,
			success: token => {
				$form.find( 'input[name="mbfs_captcha_token"]' ).val( token );
				deleteCallback();
			},
			error: () => {
				enableButtons();
				displayMessage( 'turnstile' === i18n.captchaProvider ? i18n.captchaRequired : i18n.captchaExecuteError, false );
			}
		} );
	}

	$submitBtn.on( 'click', handleSubmitClick );
	$deleteBtn.on( 'click', handleDeleteClick );
}

$( function () {
	$( '.rwmb-form' ).each( processForm );
} );
