'use strict'

$(document).ready(() => {
    $.getJSON('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json', function (data) {
        let colors = ["#15c7af", "#2c6738", "#1963b7", "#b9d754", "#b67134", "#af525c", "#81b981", "#e0373e", "#32abdd", "#1386a2"];

        let bg = $(".container");
        let newQuotebtn = $(".new-quote");
        let tweetbtn = $(".tweet-quote");
        let text = $(".text");
        let author = $(".author");
        let randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];

        let currentQuote = randomQuote.quote;
        let currentAuthor = randomQuote.author;

        text.text(currentQuote);
        author.text(currentAuthor);

        tweetbtn.click(() => {
            $("#tweet-quote").attr("href", "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
        });

        newQuotebtn.click(() => {
            let random = Math.floor((Math.random() * colors.length))

            bg.animate({
                    backgroundColor: colors[random]
                },
                1000);
            newQuotebtn.animate({
                    backgroundColor: colors[random]
                },
                1000);
            tweetbtn.animate({
                    backgroundColor: colors[random]
                },
                1000);
            text.animate({
                    color: colors[random]
                },
                1000);
            author.animate({
                    color: colors[random]
                },
                1000);

            randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
            currentQuote = randomQuote.quote;
            currentAuthor = randomQuote.author;

            $(".text-box").animate({
                    opacity: 0
                },
                500,
                function () {
                    $(this).animate({
                        opacity: 1
                    }, 500);
                    text.html(randomQuote.quote);
                });

            $(".author-box").animate({
                    opacity: 0
                },
                500,
                function () {
                    $(this).animate({
                        opacity: 1
                    }, 500);
                    author.html(randomQuote.author);
                });

            tweetbtn.click(() => {
                $("#tweet-quote").attr("href", "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
            });
        });


    })
})