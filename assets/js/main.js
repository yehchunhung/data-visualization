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
        intro: 'Welcome to UFOdex! <br /> A device that helps you spot UFOs.'
      },
      {
        element: '.ufodex-screen-button',
        intro: 'Press this button to turn on the device.'
      },
      {
        element: '.ufodex-screen-image',
        intro: 'This is the main screen that will show all the information.'
      },
      {
        element: '.ufodex-buttons',
        intro: 'Click here to check out different modes.'
      },
      {
        element: '.ufodex-goldButton',
        intro: 'Click here to show the tutorial for the current mode (It will be enabled after this tutorial).',
        position: 'left'
      },
      {
        intro: 'You\'re all set! <br /> Let\'s spot an UFO!'
      }
    ],
  });

  intro.start();

  function map_tutorial() {
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
          element: '.map',
          intro: 'Welcome to the tutorial for the map mode! Here, you can seek around past UFO sightings in US.',
          position: 'right'
        },
        {
          element: '.map',
          intro: '<font color="ff339e"><b>Red circles</b></font> indicate <b>clusters of the UFO sightings</b>. By <b>click</b>&#x1F5B1; a cluster, map automatically zoom in to the <b>sub-clusters</b> in there.',
          position: 'right'
        },
        {
          element: '.map',
          intro: '<font color="red"><b>UFO icon</b></font> shows <b>a single sighting</b>. By <b>click</b>&#x1F5B1; the icon, you can obtain <b>detailed information</b> about it.',
          position: 'right'
        },
        {
          element: '.map',
          intro: '<font color="red"><b>The Bar chart</b></font> below shows <b>annual sighting counts</b> in US. By changing the area covered by the white square, you can freely <b>choose the year range</b>. Map shows <b>the sightings occurred in the selected period</b>',
          position: 'right'
        },
        {
          element: '.map',
          intro: 'The selected <b>year range</b> and <b>the number of UFO sightings</b> in the time period are indicated in this window.',
          position: 'right'
        },
        {
          element: '.map',
          intro: '<b><u>Button configuration</u></b><br> <font size="5"><b>&loz;</b></font>: Change types of view (Dark / Street view), <br><font size="6"><b>+</b></font>: Zoom in, <br><font size="6"><b>-</b></font>: Zoom out, <br><font size="3"><b>&target;</b></font>: Map goes back to the initial location, <br><font size="4"><b>&quest;</b></font>: Secret.',
          position: 'right'
        },
        {
          element: '.map',
          intro: 'Enjoy your expedition!',
          position: 'right'
        },
      ]
    });
    intro.start();
  }

  function detailed_instructions_tutorial() {
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
          element: '.detailed-instructions',
          intro: 'Welcome to the tutorial in <b>detailed instructions</b>! <br> This section will give you some insights to help you hunt for UFO more easily.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'First of all, UFOdex only focuses on UFO sightings in <b><mark class="yellow">USA</mark></b>, discarding UFO findings in other countries.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'You can click the buttons to see the results.',
          position: 'top'
        },
        {
          element: '.detailed-instructions',
          intro: "Let's click the first button, <b>State Count</b>.",
          position: 'top'
        },
        {
          element: '.detailed-instructions',
          intro: 'Among all states, <b><mark class="yellow">California</mark></b> is the one where people spot UFOs the most. Its sighting number is much more than any other state.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'Next, move on to the second button, <b>Season Count</b>.',
          position: 'top'
        },
        {
          element: '.detailed-instructions',
          intro: 'Of all seasons, <b><mark class="yellow">summer</mark></b> is the season that people witness UFOs the most, with more than <b>20,000</b> records.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'The following 3 buttons will present specific time of UFO detection.',
          position: 'top'
        },
        {
          element: '.detailed-instructions',
          intro: 'Considering months only, <b>June to November</b> seems to have more UFO sightings in USA. Particularly, <b><mark class="yellow">July</mark></b> is the month when people sight UFOs the most.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'Considering days in a month, <b><mark class="yellow">1st and 15th</mark></b> are perfect days for the enthusiasts to hunt for UFOs.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'When it comes to specific dates, <b><mark class="yellow">July 4th</mark></b> is the most possible one followed by <b>June 1st</b>. By the way, you can move your cursor to a certain cell to check the count in that date.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'Finally, click the last button, <b>Found Duration</b>.',
          position: 'top'
        },
        {
          element: '.detailed-instructions',
          intro: 'From the past experiences, UFOs are found mostly in the duration <b><mark class="yellow">within 15 seconds</mark></b>. Hardly you can see them more than this range.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'Overall, if you want to see UFOs with your own eyes, UFOdex suggests you go to <b><mark class="yellow">California</mark></b> in <b><mark class="yellow">July</mark></b> (<b><mark class="yellow">July 4th</mark></b> if possible). Then you have higher probability to spot them shortly <b><mark class="yellow">in 15 seconds</mark></b>.',
          position: 'right'
        },
        {
          element: '.detailed-instructions',
          intro: 'That\'s it for this section. Hope you can utilize the analysis to help your UFO hunting! :)',
          position: 'right'
        }
      ]
    });
    intro.start();
  }

  function fun_facts_tutorial() {
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
          element: '.fun-facts',
          intro: 'Welcome to the tutorial in <b>fun facts</b>! UFOdex is going to present you some fun facts about UFOs.',
          position: 'right'
        },
        {
          element: '.fun-facts',
          intro: 'As usual, you can click the buttons to check different visualizations.',
          position: 'top'
        },
        {
          element: '.fun-facts',
          intro: 'If you are ready, let\'s get started!',
          position: 'top'
        },
        {
          element: '.fun-facts',
          intro: 'Do you know how UFOs look like? To answer, press the first button.',
          position: 'top'
        },
        {
          element: '.fun-facts',
          intro: 'FUN FACT 1: Regarding the appearance, most eyewitnesses describe UFOs as <b><mark class="yellow">light</mark></b> (press the icon to check the number). As for their shape, most witnesses think they are <b><mark class="yellow">triangle-shaped</mark></b>. Out of surprise, even some people think of them as <b><mark class="yellow">cigars</mark></b>.',
          position: 'right'
        },
        {
          element: '.fun-facts',
          intro: 'Next, click the second button to see how onlookers describe them.',
          position: 'top'
        },
        {
          element: '.fun-facts',
          intro: 'FUN FACT 2: From the comments these lookers-on gave, UFOs are maybe <b><mark class="yellow">bright lights</mark></b> and <b><mark class="yellow">moving objects</mark></b> with some colors like <b><mark style="background-color:orange">orange</mark></b>, <b><mark style="background-color:white">white</mark></b>, or <b><mark style="background-color:red">red</mark></b>.',
          position: 'right'
        },
        {
          element: '.fun-facts',
          intro: 'Done! In this section, you\'ve learned the fun facts about UFOs. Hope you grasp some fun knowledge! :)',
          position: 'right'
        }
      ]
    });
    intro.start();
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

  // Control special operations between steps in tutorial
  let original_onclick = $('.introjs-nextbutton').get(0).onclick;

  intro.onafterchange(() => {
    if (intro._currentStep == 1 && !right_panel_opened) {
      original_onclick = $('.introjs-nextbutton').get(0).onclick;
      disable_next();
    } else {
      enable_next(original_onclick);
    }

    if (intro._currentStep == 4) {
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

    showMode(opened_mode, '.fun-facts');
    opened_mode = '.fun-facts';
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
    switch (opened_mode) {
      case '.map':
        map_tutorial();
        break;
      case '.detailed-instructions':
        detailed_instructions_tutorial();
        break;
      case '.fun-facts':
        fun_facts_tutorial();
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
