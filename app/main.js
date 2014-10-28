'use strict';

//starting point of sweepstakes app
var config = require('./config'),
    $      = require('jquery-browserify');

function InStorySweepstake() {
  var templateLandingPage = global.JST["app/templates/templateLandingPage.html"];
  var templateThankYou = global.JST["app/templates/templateThankYou.html"];
  var data1 = {
    brands: [
      {
        name: "Brand1",
        facebook_url: "brand face",
        pinterest_url: "brand_pin",
        privacy_url: "privacy url"
      }
    ],
    call_to_action: "cta",
    share_url: "share url"
  }
  var data2 = {
    brands: [
      {
        name: "Brand1",
        facebook_url: "brand face",
        pinterest_url: "brand_pin"
      }
    ],
    call_to_action: "cta",
    shareFbUrl: "share url",
    shareTwitterUrl: "share twitter url",
    sharePinterestUrl: "share pinterest url",
    rules_url: "rules"

  }
  $("#instory-sweepstake-landing").html(templateLandingPage({ data: data1 }));
  $("#instory-sweepstake-thank-you").html(templateThankYou({ data: data2 }));
}

$(function init() {
  InStorySweepstake();
});
