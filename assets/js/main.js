function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    // `DOMContentLoaded` already fired
    action();
  }
}

function disable_next() {
  if ($('.introjs-nextbutton')[0]) {
    $('.introjs-nextbutton').addClass('introjs-disabled');
    $('.introjs-nextbutton').get(0).onclick = null;
  }
}

function enable_next(original_onclick) {
  if ($('.introjs-nextbutton')[0]) {
    $('.introjs-nextbutton').removeClass('introjs-disabled');
    $('.introjs-nextbutton').get(0).onclick = original_onclick;
  }
}

function disable_gold() {
  $('.ufodex-goldButton').css('cursor', 'default');
  $('.ufodex-goldButton').attr('disabled', 'disabled');
}

function enable_gold() {
  $('.ufodex-goldButton').css('cursor', 'pointer');
  $('.ufodex-goldButton').removeAttr('disabled');
}

function open_device(opened_mode, original_onclick) {
  enable_next(original_onclick);

  $('.ufodex-right').animate({
    left: '860px'
  }, 600, () => {
    $('.ufodex-right').css('z-index', 99);
    $('.ufodex-screen-image').fadeTo(0, 1);
    showMode(opened_mode, opened_mode, 0);
  });
}

function close_device() {
  disable_next();

  // Remove text on the right info screen
  $('.ufodex-info-container').html('');

  $('.ufodex-screen-image').fadeTo(160, 0);
  $('.ufodex-right').animate({
    left: '500px'
  }, 600);
}

function showMode(lastMode, mode, out_speed = 150, in_speed = 150) {
  // Show current mode
  $('.ufodex-info-container').html(mode.substring(1).replace('-', ' ').toUpperCase());
  $(lastMode).fadeTo(out_speed, 0, () => {
    $(lastMode).hide(() => {
      $(mode).show();
      $(mode).css('display', 'flex');
      $(mode).fadeTo(in_speed, 1);
    });
  });
}

function about_us_tutorial() {
  const intro = introJs();
  intro.setOptions({
    hidePrev: true,
    hideNext: true,
    keyboardNavigation: false,
    showBullets: false,
    showProgress: false,
    showStepNumbers: false,
    exitOnOverlayClick: false,
    steps: [
      {
        element: '.about-us',
        intro: 'You can learn about us here :)',
        position: 'right'
      }
    ]
  });
  intro.start();
}

whenDocumentLoaded(() => {
  // Define tutorials
  const intro = introJs();

  intro.setOptions({
    hidePrev: true,
    hideNext: true,
    keyboardNavigation: false,
    showBullets: false,
    showProgress: true,
    exitOnOverlayClick: false,
    steps: [
      {
        intro: 'Welcome to UFOdex!'
      },
      {
        element: '.ufodex-screen-button',
        intro: 'Press this button to turn on the device.'
      },
      {
        element: '.ufodex-screen-image',
        intro: 'This is your main screen.'
      },
      {
        element: '.ufodex-goldButton',
        intro: 'Click here to show the tutorial for the current mode (It will be enabled after this tutorial).',
        position: 'left'
      },
      {
        element: '.ufodex-buttons',
        intro: 'Click here to check out different modes.'
      },
      {
        intro: 'You\'re all set! <br /> Let\'s spot an UFO!'
      }
    ],
  });

  intro.start();

  // Control special operations between steps in tutorial
  let original_onclick = $('.introjs-nextbutton').get(0).onclick;

  intro.onafterchange(() => {
    if (intro._currentStep == 1 && !right_panel_opened) {
      original_onclick = $('.introjs-nextbutton').get(0).onclick;
      disable_next();
    } else {
      enable_next(original_onclick);
    }

    if (intro._currentStep == 3) {
      disable_gold();
    } else {
      enable_gold();
    }
  });

  intro.onexit(() => { enable_gold(); });


  // Turn on and off the UFOdex
  let right_panel_opened = false;
  let opened_mode = '.map';

  // Open or close UFOdex
  $('.ufodex-screen-button').click(() => {
    // Prevent button spamming
    if ($('.ufodex-right').is(':animated')) { return false; }

    // Move right panel to back when moving it
    $('.ufodex-right').css('z-index', -1);

    if (right_panel_opened) {
      close_device();
    } else {
      open_device(opened_mode, original_onclick);
    }
    right_panel_opened = !right_panel_opened;
  });


  // Open different modes
  $('.ufodex-button.first').click(() => {
    // Prevent button spamming
    if ($(opened_mode).is(':animated')) { return false; }

    showMode(opened_mode, '.map');
    opened_mode = '.map';
  });
  $('.ufodex-button.second').click(() => {
    // Prevent button spamming
    if ($(opened_mode).is(':animated')) { return false; }

    showMode(opened_mode, '.detailed-instructions');
    opened_mode = '.detailed-instructions';
  });
  $('.ufodex-button.third').click(() => {
    // Prevent button spamming
    if ($(opened_mode).is(':animated')) { return false; }

    showMode(opened_mode, '.cool-facts');
    opened_mode = '.cool-facts';
  });
  $('.ufodex-button.forth').click(() => {
    // Prevent button spamming
    if ($(opened_mode).is(':animated')) { return false; }

    showMode(opened_mode, '.about-us');
    opened_mode = '.about-us';
  });


  // Start tutorial for the current mode
  $('.ufodex-goldButton').click(() => {
    if ($('.ufodex-goldButton').attr('disabled') == 'disabled') { return false; }
    console.log(opened_mode[1].toUpperCase() + opened_mode.substring(2).replace('-', ' ') + ' tutorial.');
    switch (opened_mode) {
      case '.map':
        break;
      case '.detailed-instructions':
        break;
      case '.cool-facts':
        break;
      case '.about-us':
        about_us_tutorial();
        break;
    }
  });


  // Easter eggs
  $('.ufodex-dualButton.first').click(() => {
    $('.ufodex-lights-lg').addClass('blink');
    setTimeout(() => { $('.ufodex-lights-lg').removeClass('blink'); }, 3000);
  });

  $('.ufodex-dualButton.second').click(() => {
    $('.ufodex-lights-sm-light').addClass('blink');
    setTimeout(() => { $('.ufodex-lights-sm-light').removeClass('blink'); }, 3000);
  });

  $('.ufodex-blackButton').click(() => {
    $('.ufodex-lights-lg-ufo').slideDown(100);
    $('.ufodex-lights-lg-ufo').addClass('circle');
    setTimeout(() => {
      $('.ufodex-lights-lg-ufo').removeClass('circle');
      $('.ufodex-lights-lg-ufo').slideUp(100);
    }, 3000);
  });
});
