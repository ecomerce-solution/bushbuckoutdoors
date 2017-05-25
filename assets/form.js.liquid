if ((typeof Shopify) === 'undefined') { Shopify = {}; } 
// Timber functions
window.timber = window.timber || {}; 
timber.cacheSelectors = function () {
  timber.cache = {
    // General
    $html                    : $('html'),
    $body                    : $('body'), 
    // Customer Pages
    $recoverPasswordLink     : $('#RecoverPassword'),
    $hideRecoverPasswordLink : $('#HideRecoverPasswordLink'),
    $recoverPasswordForm     : $('#RecoverPasswordForm'),
    $customerLoginForm       : $('#CustomerLoginForm'),
    $passwordResetSuccess    : $('#ResetSuccess')
  };
};

timber.init = function () {
  FastClick.attach(document.body);
  timber.cacheSelectors(); 
  timber.loginForms();
};
 
timber.getHash = function () {
  return window.location.hash;
}; 
timber.updateHash = function (hash) {
  window.location.hash = '#' + hash;
  $('#' + hash).attr('tabindex', -1).focus();
}; 
timber.loginForms = function() {
  function showRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.show();
    timber.cache.$customerLoginForm.hide();
  }

  function hideRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.hide();
    timber.cache.$customerLoginForm.show();
  }

  timber.cache.$recoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    showRecoverPasswordForm();
  });

  timber.cache.$hideRecoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    hideRecoverPasswordForm();
  });

  // Allow deep linking to recover password form
  if (timber.getHash() == '#recover') {
    showRecoverPasswordForm();
  }
};

timber.resetPasswordSuccess = function() {
  timber.cache.$passwordResetSuccess.show();
};
 

// Initialize Timber's JS on docready
$(timber.init);
