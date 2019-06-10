$(document).ready(() => {
  // GLOBALS
  var gifAPI = "https://api.giphy.com/v1/gifs/";
  var gifDevKey = "ddorAj1BeWlKJQEUjbRpNklvrn8YJGZV";
  var topics = ["Cats", "Dogs", "Fish", "Ducks"];

  (function onFirstLoad() {
    getGiphy("search", topics[0]);

    renderButtons();
  })();

  //// EVENT LISTENERS

  // Event on any gif button
  $(".button-box").on("click", ".btn-default", queryAPI);

  // Event to [de]active the gif
  $(".gifs-container").on("click", ".gif-frame img", function() {
    var active = $(this).attr("data-active") || "false";

    if (active === "false") {
      $(this).attr("data-active", "true");
      $(this).attr("src", $(this).data("moving"));
    } else {
      $(this).attr("data-active", "false");
      $(this).attr("src", $(this).data("still"));
    }

    $(this).toggleClass("active-gif");
  });

  // Event on Form Button
  $("button#add-gif").on("click", e => {
    e.preventDefault();
    var gif = $("#gif-input")
      .val()
      .trim();

    getGiphy("search", gif);

    if (gif.length > 0 && topics.indexOf(gif) === -1) {
        topics.push(gif);
      renderButtons();
    }
    $("#gif-input").val("");
  });

  // Function to create buttons
  function renderButtons() {
    $(".button-box").empty();

    for (var i in topics) {
      var b = $("<button>");

      b.addClass("btn btn-default");
      // Added a data-attribute
      b.attr("data-name", topics[i]);
      // Provided the initial button text
      b.text(topics[i]);
      // Added the button to the buttons-view div
      $(".button-box").append(b);
    }
  }

  function queryAPI() {
    //pull queryString from callers data-name attribute
    console.log($(this).attr("data-name"));
    getGiphy("search", $(this).attr("data-name"));
  }

  function getGiphy(queryType, queryStr) {
    var queryURL =
      gifAPI +
      queryType +
      "?q=" +
      queryStr +
      "&rating=pg&limit=10&api_key=" +
      gifDevKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(response => {
      console.log("finished ajax");
      var gifObjs = response.data,
        gifCont = $(".gifs-container");

      gifCont.empty();

      if (gifObjs.length == 0) {
        gifCont.append("<div>Sorry. Nothing exists. Try again!");
        console.log(topics, topics.indexOf(queryStr));
        topics.splice(topics.indexOf(queryStr), 1);
        renderButtons();
      } else {
        gifObjs.forEach(gif => {
          var gifFrame = $("<div>").addClass("gif-frame");
          var gifImg = $("<img>").append(
            "<span class='rating'>" + gif.rating + "</span>"
          );

          gifImg.data("still", gif.images.original_still.url);
          // initial img is the still version
          gifImg.attr("src", gif.images.original_still.url);
          gifImg.data("moving", gif.images.original.url);
          // Add img to Frame
          gifFrame.append(gifImg);
          // Add html to DOM
          gifCont.append(gifFrame);
        });
      }
    });
  }
});
